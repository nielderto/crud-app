"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/app-ui/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import LoadingScreen from "@/components/app-ui/LoadingScreen";
import Redirect from "@/components/app-ui/Redirect";
import { usePost } from "@/hooks/use-posts";

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const { data: session, isPending } = authClient.useSession();
    const { post, loading: postLoading } = usePost(params.id as string, !!session);
    const [title, setTitle] = useState<string | null>(null);
    const [content, setContent] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    if (!isPending && !session) {
        return <Redirect to="/login" />;
    }

    const user = session ? {
        name: session.user.name,
        username: (session.user as Record<string, unknown>).username as string || "",
        email: session.user.email,
    } : null;

    // Redirect if not the author
    if (post && session && post.authorId !== session.user.id) {
        return <Redirect to="/dashboard" />;
    }

    const currentTitle = title ?? post?.title ?? "";
    const currentContent = content ?? post?.content ?? "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {
            const res = await fetch(`http://localhost:3001/api/posts/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ title: currentTitle, content: currentContent }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push(`/dashboard/post/${params.id}`);
            } else {
                setError(data.error || "Failed to update post");
                setSaving(false);
            }
        } catch {
            setError("Something went wrong. Please try again.");
            setSaving(false);
        }
    };

    if (isPending || postLoading || !user) {
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
                    onClick={() => router.push(`/dashboard/post/${params.id}`)}
                    className="flex items-center gap-1 text-sm text-neutral-500 hover:text-emerald-400 transition-colors mb-8 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-900/30 rounded-md p-2">
                            {error}
                        </div>
                    )}

                    <div className="border border-neutral-700 rounded-md bg-transparent overflow-hidden">
                        <Input
                            type="text"
                            placeholder="Title"
                            value={currentTitle}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="text-3xl font-bold text-white placeholder:text-neutral-500 focus-visible:ring-0 border-none border-b border-neutral-800 rounded-none px-4 h-auto py-3 bg-transparent"
                        />
                        <div className="border-t border-neutral-800" />
                        <Textarea
                            placeholder="Tell your story..."
                            value={currentContent}
                            onChange={(e) => setContent(e.target.value)}
                            rows={16}
                            className="text-lg text-neutral-300 placeholder:text-neutral-500 focus-visible:ring-0 border-none rounded-none px-4 py-3 resize-none leading-relaxed bg-transparent"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/dashboard/post/${params.id}`)}
                            className="text-neutral-400 border-neutral-700 hover:text-white hover:bg-neutral-900 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving || !currentTitle}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/60 cursor-pointer disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
