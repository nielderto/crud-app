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

export function usePosts(searchQuery?: string) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async (query?: string) => {
        setLoading(true);
        try {
            const url = query
                ? `http://localhost:3001/api/posts?search=${encodeURIComponent(query)}`
                : "http://localhost:3001/api/posts";

            const res = await fetch(url, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || []);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(searchQuery);
    }, [searchQuery, fetchPosts]);

    return { posts, loading, fetchPosts };
}

export function usePost(id: string) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/posts/${id}`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setPost(data.post);
                }
            } catch (error) {
                console.error("Failed to fetch post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    return { post, loading };
}
