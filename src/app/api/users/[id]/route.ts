import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid user Id" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio : true,
        location:true,
        image : true,
        github : true,
        Linkdin : true,
        Instagram : true,
        website : true,
        
        posts: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            createdAt: true,

            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,

            post: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        _count: {
          select: {
            posts: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },

        {
          status: 404,
        },
      );
    }
    const mappedUser = {
      ...user,
      gitHubUrl: user.github,
      linkedinUrl: user.Linkdin,
      instagramUrl: user.Instagram,
      websiteUrl: user.website,
    };
    return NextResponse.json(mappedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while fetching a user" },
      { status: 400 },
    );
  }
}


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const userId = id;

    if (!userId) {
      return NextResponse.json({ error: "Invalid User Id" }, { status: 400 });
    }
    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: body.name,
        github: body.gitHubUrl,
        Instagram: body.instagramUrl,
        Linkdin: body.linkedinUrl,
        bio: body.bio,
        website: body.websiteUrl,
        location: body.location,
      },
    });
    const mappedUser = {
      ...updatedUser,
      gitHubUrl: updatedUser.github,
      linkedinUrl: updatedUser.Linkdin,
      instagramUrl: updatedUser.Instagram,
      websiteUrl: updatedUser.website,
    };
    return NextResponse.json(mappedUser);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something Went Wrong while editing the user.",
      },
      { status: 500 },
    );
  }
}



export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = id;

    if (!userId) {
      return NextResponse.json(
        {
          error: "Invalid user id",
        },
        {
          status: 400,
        },
      );
    }
    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await prisma.user.update({
      where: {
        id: userId,
      },
      data : {
        isDeleted : true,
        deletedAt : new Date()
      }
    });
    return NextResponse.json({
      message: "User Deleted Successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something Went Wrong while deleting the user" },
      { status: 500 },
    );
  }
}