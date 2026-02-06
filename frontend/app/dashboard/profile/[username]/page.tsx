"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/app-ui/Navbar";
import PostCard from "@/components/app-ui/PostCard";
import LoadingScreen from "@/components/app-ui/LoadingScreen";
import Redirect from "@/components/app-ui/Redirect";
import { useProfile } from "@/hooks/use-profile";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const [activeTab, setActiveTab] = useState("posts");
    const { data: session, isPending } = authClient.useSession();
    const { user: profileUser, posts, comments, loading } = useProfile(
        params.username as string
    );

    if (!isPending && !session) {
        return <Redirect to="/login" />;
    }

    const currentUser = session ? {
        name: session.user.name,
        username: (session.user as Record<string, unknown>).username as string || "",
        email: session.user.email,
    } : null;

    if (isPending || loading || !currentUser) {
        return <LoadingScreen />;
    }

    if (!profileUser) {
        return (
            <div>
                <Navbar user={currentUser} />
                <main className="mx-auto max-w-2xl px-6 py-8">
                    <p className="text-neutral-400 text-center py-16">User not found</p>
                </main>
            </div>
        );
    }

    const memberSince = new Date(profileUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div>
            <Navbar user={currentUser} />

            <main className="mx-auto max-w-2xl px-6 py-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-sm text-neutral-500 hover:text-emerald-400 transition-colors mb-8 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                {/* Profile header */}
                <div className="flex items-center gap-4 mb-8">
                    <img
                        src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${profileUser.username || "user"}`}
                        alt="avatar"
                        className="h-16 w-16 rounded-full bg-neutral-800"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {profileUser.name || profileUser.username}
                        </h1>
                        <p className="text-sm text-neutral-500">
                            @{profileUser.username} · Joined {memberSince}
                        </p>
                        <div className="flex gap-4 mt-1">
                            <span className="text-xs text-neutral-400">{posts.length} posts</span>
                            <span className="text-xs text-neutral-400">{comments.length} comments</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList variant="line" className="w-full border-b border-neutral-800 mb-6">
                        <TabsTrigger value="posts" className="text-neutral-400 data-[state=active]:text-emerald-400 after:bg-emerald-400 cursor-pointer">
                            Posts
                        </TabsTrigger>
                        <TabsTrigger value="comments" className="text-neutral-400 data-[state=active]:text-emerald-400 after:bg-emerald-400 cursor-pointer">
                            Comments
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        {activeTab === "posts" && (
                            posts.length === 0 ? (
                                <p className="text-neutral-600 text-sm text-center py-8">No posts yet.</p>
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
                            )
                        )}

                        {activeTab === "comments" && (
                            comments.length === 0 ? (
                                <p className="text-neutral-600 text-sm text-center py-8">No comments yet.</p>
                            ) : (
                                <div className="flex flex-col">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="border-b border-neutral-800 py-4">
                                            <Link
                                                href={`/dashboard/post/${comment.post.id}`}
                                                className="text-xs text-neutral-500 hover:text-emerald-400 transition-colors mb-2 block"
                                            >
                                                on &quot;{comment.post.title}&quot;
                                            </Link>
                                            <p className="text-neutral-300 text-sm line-clamp-1">{comment.content}</p>
                                            <span className="text-xs text-neutral-600 mt-2 block">
                                                {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {new Date(comment.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
