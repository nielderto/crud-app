import Link from "next/link";

interface PostCardProps {
    id: number;
    title: string;
    content: string | null;
    author: { name: string | null; username: string | null };
    createdAt: string;
}

export default function PostCard({ id, title, content, author, createdAt }: PostCardProps) {
    const date = new Date(createdAt);
    const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const formattedTime = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const preview = content
        ? content.length > 160 ? content.slice(0, 160) + "..." : content
        : "No content";

    return (
        <Link href={`/dashboard/post/${id}`}>
            <article className="group border-b border-neutral-800 py-6 cursor-pointer">
                <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <img
                                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${author.username || "user"}`}
                                alt="avatar"
                                className="h-5 w-5 rounded-full bg-neutral-800"
                            />
                            <span className="text-sm text-neutral-400">
                                {author.name || author.username}
                            </span>
                            <span className="text-xs text-neutral-600">·</span>
                            <span className="text-xs text-neutral-500">{formattedTime}</span>
                        </div>

                        <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight mb-1">
                            {title}
                        </h2>

                        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">
                            {preview}
                        </p>
                    </div>
                </div>
            </article>
        </Link>
    );
}
