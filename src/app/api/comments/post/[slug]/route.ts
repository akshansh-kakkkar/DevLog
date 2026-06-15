import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { commentSchema } from "@/app/api/validators/comments";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const url = new URL(request.url);

    const page = Number(
      url.searchParams.get("page") ?? 1
    )
    const limit = 10;
    
    const Post = await prisma.post.findUnique({
      where: {
        slug,
      },
      select: {
        id : true,
        slug : true,
        title : true
      },
    });
    if (!Post) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
     const comments =await prisma.comment.findMany({
      where : {
        postId : Post.id
      },
      include : {
        author : true,
      },
      orderBy : {
        createdAt : "desc"
      },
      skip : (page - 1) * limit,
      take  : limit
     })
     const totalComments = await prisma.comment.count({
      where : {
        postId : Post.id
      }
     })
    return NextResponse.json({
      comments,
      pagination : {
        currentPage : page,
        totalComments,
        totalPages : Math.ceil(totalComments/limit),
        hasMore : page * limit < totalComments
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching the comments" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const validation = commentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Content and authorId are required" },
        { status: 400 },
      );
    }
    const existingPost = await prisma.post.findUnique({
      where: {
        slug,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        {
          error: "Post not found",
        },
        {
          status: 404,
        },
      );
    }
    const newComment = await prisma.comment.create({
      data: {
        content: validation.data.content,
        postId: existingPost.id,
        authorId: String(session.user.id),
      },
      include: {
        author: true,
        post: true,
      },
    });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something Went wrong while posting the comment" },
      { status: 500 },
    );
  }
}
