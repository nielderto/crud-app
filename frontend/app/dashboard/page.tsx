"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/app-ui/Navbar";
import PostCard from "@/components/app-ui/PostCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import LoadingScreen from "@/components/app-ui/LoadingScreen";
import Redirect from "@/components/app-ui/Redirect";

export default function DashboardPage() {
    const { data: session, isPending } = authClient.useSession();
    const { posts, loading, fetchPosts } = usePosts(!!session);
    const [search, setSearch] = useState("");

    if (!isPending && !session) {
        return <Redirect to="/login" />;
    }

    const user = session ? {
        name: session.user.name,
        username: (session.user as Record<string, unknown>).username as string || "",
        email: session.user.email,
    } : null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchPosts(search);
    };

    if (isPending || !user) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <Navbar user={user} />

            <main className="mx-auto max-w-2xl px-6 py-8">
                <form onSubmit={handleSearch} className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                        type="text"
                        placeholder="Search your posts..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            if (e.target.value === "") fetchPosts();
                        }}
                        className="pl-10 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20"
                    />
                </form>

                {loading ? (
                    <p className="text-center text-neutral-500 py-12">Loading posts...</p>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-neutral-400 text-lg mb-2">No posts yet</p>
                        <p className="text-neutral-600 text-sm">
                            Click &quot;Write&quot; to create your first post.
                        </p>
                    </div>
                ) : (
                    <div>
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                content={post.content}
                                author={post.author}
                                createdAt={post.createdAt}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
