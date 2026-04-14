export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    thumbnail?: string | null;
    published: boolean;
    publishedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    views: number;
    tags: Array<{id: string; name: string; slug: string; color?: string}>
    author?: {
        id: string;
        name: string | null;
        email: string | null ;
    } | null;
    content: string
}