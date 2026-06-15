import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const whereClause = {
        authorId: String(session.user.id)
    }
    const posts = await prisma.post.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
            createdAt: "desc"
        }
    })
    const allPosts = await prisma.post.findMany({
        where : whereClause,
        orderBy : {
            createdAt : 'desc'
        }
    })
    const totalPosts = await prisma.post.count({
        where: whereClause
    })
    return NextResponse.json({
        posts,
        allPosts,
        pagination: {
            currentPage: page,
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit)

        }
    })

}