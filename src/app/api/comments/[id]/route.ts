import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const commentId = parseInt(id);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: "Invalid comment id" },
        { status: 400 },
      );
    }
    const body = await request.json();
    if (!body.content) {
      return NextResponse.json({ error: "Comment is required" }, { status: 400 });
    }
    const existingComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (existingComment.authorId !== String(session.user.id)){
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: body.content,
      },
      include: {
        author: true,
        post: true,
      },
    });
    return NextResponse.json(updatedComment);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while updating the comment" },
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
    const commentId = parseInt(id);
    if(isNaN(commentId)){
        return NextResponse.json({error : "Invalid comment id."}, {status : 400})
    }
    const existingComment = await prisma.comment.findUnique({
        where : {
            id : commentId
        }
    })
    if(!existingComment){
        return NextResponse.json({
            error : "commment not found"
        }, {status : 404})
    }
    if(existingComment.authorId !== String(session.user.id)){
        return NextResponse.json({error : "Forbidden"}, { status : 403})
    }
    await prisma.comment.delete({
        where : {
            id : commentId
        }
    })
    return NextResponse.json({
        message : "comment deleted successfully"
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Something Went Wrong while deleting the comment" },
      { status: 500 },
    );
  }
}
