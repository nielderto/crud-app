"use client";

import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/app-ui/Navbar";
import PostCard from "@/components/app-ui/PostCard";
import { usePosts } from "@/hooks/use-posts";
import LoadingScreen from "@/components/app-ui/LoadingScreen";
import Redirect from "@/components/app-ui/Redirect";

export default function DashboardPage() {
    const { data: session, isPending } = authClient.useSession();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || undefined;
    const { posts, loading } = usePosts(searchQuery);

    if (!isPending && !session) {
        return <Redirect to="/login" />;
    }

    const user = session ? {
        name: session.user.name,
        username: (session.user as Record<string, unknown>).username as string || "",
        email: session.user.email,
    } : null;

    if (isPending || !user) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <Navbar user={user} />

            <main className="mx-auto max-w-2xl px-6 py-8">
                {loading ? (
                    <p className="text-center text-neutral-500 py-12">Loading posts...</p>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-neutral-400 text-lg mb-2">
                            {searchQuery ? "No posts found" : "No posts yet"}
                        </p>
                        <p className="text-neutral-600 text-sm">
                            {searchQuery
                                ? `No results for "${searchQuery}".`
                                : 'Click "Write" to create your first post.'}
                        </p>
                    </div>
                ) : (
                    <div>
                        {searchQuery && (
                            <p className="text-neutral-500 text-sm mb-4">
                                Results for &quot;{searchQuery}&quot;
                            </p>
                        )}
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
