import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createPostSchema } from "../validators/post";
import { generateSlug } from "@/lib/slug";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    const whereClause = {
      status: "PUBLISHED" as const,
      visibility: "PUBLIC" as const,
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const posts = await prisma.post.findMany({
      where: whereClause,

      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },

      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    });
    const totalPosts = await prisma.post.count({
      where: whereClause,
    });
    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasMore : page * limit < totalPosts,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong whiel fetching the posts." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createPostSchema.safeParse(body);
    console.log(validation.error?.flatten());
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 },
      );
    }
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tags = validation.data.tags || [];
    let status = validation.data.status ?? "DRAFT";
    if (validation.data.scheduledAt) {
      status = "SCHEDULED";
    } else if (status !== "DRAFT") {
      status = "PUBLISHED";
    }
    const baseSlug = generateSlug(validation.data.title);
    const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
    const newPost = await prisma.post.create({
      data: {
        title: validation.data.title,
        slug,
        content: validation.data.content,
        coverImage: validation.data.coverImage,
        authorId: String(session.user.id),
        status,
        ScheduledAt:
          status === "SCHEDULED"
            ? new Date(validation.data.scheduledAt!)
            : null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        visibility: validation.data.visibility ?? "PUBLIC",
        postTags: {
          create: await Promise.all(
            tags.map(async (tagname) => {
              const tag = await prisma.tag.upsert({
                where: {
                  name: tagname.toLowerCase(),
                },
                update: {},
                create: {
                  name: tagname.toLowerCase(),
                },
              });
              return {
                tag: {
                  connect: {
                    id: tag.id,
                  },
                },
              };
            }),
          ),
        },
      },
      include: {
        author: true,
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("POST ERROR");
    console.dir(error, { depth: null });
    return NextResponse.json(
      {
        error: `${error}, Something Went Wrong while posting the post.`,
        details:
          error instanceof Error ? error.stack : JSON.stringify(error, null, 2),
      },

      { status: 500 },
    );
  }
}
