"use client";

import { useState, useEffect, useCallback } from "react";

interface Post {
    id: number;
    title: string;
    content: string | null;
    published: boolean;
    authorId: string;
    author: { name: string | null; username: string | null };
    createdAt: string;
}

export function usePosts(sessionReady: boolean) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async (query?: string) => {
        try {
            const url = query
                ? `http://localhost:3001/api/posts?search=${encodeURIComponent(query)}`
                : "http://localhost:3001/api/posts";

            const res = await fetch(url, { credentials: "include" });
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (sessionReady) fetchPosts();
    }, [sessionReady, fetchPosts]);

    return { posts, loading, fetchPosts };
}

export function usePost(id: string, sessionReady: boolean) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionReady) return;

        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/posts/${id}`, {
                    credentials: "include",
                });
                const data = await res.json();

                if (res.ok) {
                    setPost(data.post);
                }
            } catch (error) {
                console.error("Failed to fetch post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, sessionReady]);

    return { post, loading };
}
