export interface Post {
    id: number;
    slug : string
    title: string;
    content: string;
    authorId: number | string;
    author?: User;
    createdAt: string;
    updatedAt: string;
    image?: string;
    coverImage?:string[];
    status : "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED" | string;
    visibility? : "PUBLIC" | "PRIVATE" | "UNLISTED" | string;
    ScheduledAt : string;
    publishedAt : string;
     
}

export interface User {
    id: number;
    name: string;
    email: string;
    posts?: string[];
}

export interface Comment {
    id: number;
    content: string;
    postId: number;
    authorId: number;
    createdAt: string;
}
