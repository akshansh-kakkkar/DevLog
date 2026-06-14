import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { updatePostSchema } from "../../validators/post";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { slug } = await params;

    const Post = await prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
        likes: true,
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });
    const session = await getSession();

    if (!Post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (
      Post.status !== "PUBLISHED" &&
      String(session?.user.id) !== Post.authorId
    ) {
      return NextResponse.json({ error: "POST not foun" }, { status: 404 });
    }
    if (session && String(session.user.id) !== Post.authorId) {
      try {
        await prisma.postView.upsert({
          where: {
            postId_userId: {
              postId: Post.id,
              userId: String(session.user.id),
            },
          },
          update: {},
          create: {
            postId: Post.id,
            userId: String(session.user.id),
          },
        });
      } catch (error) {
        console.error("Error fetching views", error);
      }
    }
    const plainText = Post.content.replace(/<[^>]*>/g, "").trim();
    const wordCount =
      plainText.length === 0 ? 0 : plainText.split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const publishCount =  await prisma.post.count({
      where : {status : "PUBLISHED"}
    })
    const scheduleCount = await prisma.post.count({
      where : {status : "SCHEDULED"}
    })
    const draftCount = await prisma.post.count({
      where : {status : "DRAFT"}
    })
    const fullPost = {
      ...Post,
      hasLiked: session
        ? Post.likes.some(
            (like: any) => like.userId === String(session.user.id),
          )
        : false,
      stats: {
        commentCount: Post.comments.length,
        likeCount: Post.likes.length,
        wordCount,
        readingTime: `${readingTimeMinutes} min read`,
      },
    };
    return NextResponse.json({
      post: fullPost,
      publishCount,
      scheduleCount,
      draftCount
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching the posts" },
      { status: 500 },
    );
  }
}

export async function PUT(
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
    const validation = updatePostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
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
          error: "Post Not Found",
        },
        { status: 404 },
      );
    }
    if (existingPost.authorId !== String(session.user.id)) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        { status: 403 },
      );
    }
    const updatedPost = await prisma.post.update({
      where: {
        slug,
      },
      data: {
        title: validation.data.title,
        content: validation.data.content,
        coverImage: validation.data.coverImage,
      },
      include: {
        author: true,
        comments: true,
        likes: true,
      },
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something Went Wrong while updating the posts.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = await params;

    const existingPost = await prisma.post.findUnique({
      where: {
        slug,
      },
    });
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (existingPost.authorId !== String(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await prisma.$transaction([
      prisma.postTag.deleteMany({
        where: {
          PostId: existingPost.id,
        },
      }),
      prisma.postView.deleteMany({
        where: {
          postId: existingPost.id,
        },
      }),
      prisma.like.deleteMany({
        where: {
          postId: existingPost.id,
        },
      }),
      prisma.comment.deleteMany({
        where: {
          postId: existingPost.id,
        },
      }),
      prisma.post.deleteMany({
        where: {
          slug,
        },
      }),
    ]);
    return NextResponse.json(
      {
        message: "Post deleted Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE Error");
    console.dir(error, { depth: null });
    return NextResponse.json(
      {
        error: "Something went wrong while deleting the post.",
        details:
          error instanceof Error ? error.stack : JSON.stringify(error, null, 2),
      },
      { status: 500 },
    );
  }
}
