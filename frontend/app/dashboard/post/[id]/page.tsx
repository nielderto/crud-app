"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/app-ui/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { usePost } from "@/hooks/use-posts";
import LoadingScreen from "@/components/app-ui/LoadingScreen";
import Redirect from "@/components/app-ui/Redirect";

export default function PostPage() {
    const router = useRouter();
    const params = useParams();
    const { data: session, isPending } = authClient.useSession();
    const { post, loading } = usePost(params.id as string, !!session);
    const [deleting, setDeleting] = useState(false);

    if (!isPending && !session) {
        return <Redirect to="/login" />;
    }

    const user = session ? {
        name: session.user.name,
        username: (session.user as Record<string, unknown>).username as string || "",
        email: session.user.email,
    } : null;

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        setDeleting(true);

        try {
            const res = await fetch(`http://localhost:3001/api/posts/${params.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                router.push("/dashboard");
            }
        } catch {
            setDeleting(false);
        }
    };

    if (isPending || loading || !user) {
        return <LoadingScreen />;
    }

    if (!post) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <Navbar user={user} />

            <main className="mx-auto max-w-2xl px-6 py-8">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-1 text-sm text-neutral-500 hover:text-emerald-400 transition-colors mb-8 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <article>
                    <div className="flex items-center gap-3 mb-6">
                        <img
                            src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${post.author.username || "user"}`}
                            alt="avatar"
                            className="h-10 w-10 rounded-full bg-neutral-800"
                        />
                        <div>
                            <p className="text-sm font-medium text-white">
                                {post.author.name || post.author.username}
                            </p>
                            <p className="text-xs text-neutral-500">
                                @{post.author.username} · {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {new Date(post.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                            </p>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                        {post.title}
                    </h1>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-neutral-300 text-lg leading-relaxed whitespace-pre-wrap">
                            {post.content || "No content."}
                        </p>
                    </div>

                    {session && post.authorId === session.user.id && (
                        <div className="flex gap-2 mt-12 pt-6 border-t border-neutral-800">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/dashboard/edit/${post.id}`)}
                                className="gap-1.5 text-neutral-400 border-neutral-800 hover:text-emerald-400 hover:bg-neutral-900 hover:border-emerald-900/50 cursor-pointer"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="gap-1.5 text-red-400 border-neutral-800 hover:text-red-300 hover:bg-red-950/30 hover:border-red-900/50 cursor-pointer"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                {deleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    )}
                </article>
            </main>
        </div>
    );
}
