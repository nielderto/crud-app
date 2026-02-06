"use client";

import { useState, useEffect, useCallback } from "react";

interface ProfileUser {
    id: string;
    name: string | null;
    username: string | null;
    createdAt: string;
}

interface ProfilePost {
    id: number;
    title: string;
    content: string | null;
    published: boolean;
    authorId: string;
    createdAt: string;
    author: { name: string | null; username: string | null };
}

interface ProfileComment {
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
    author: { name: string | null; username: string | null };
    post: { id: number; title: string };
}

export function useProfile(username: string) {
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [posts, setPosts] = useState<ProfilePost[]>([]);
    const [comments, setComments] = useState<ProfileComment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/posts/user/${username}`, {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setPosts(data.posts || []);
                setComments(data.comments || []);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { user, posts, comments, loading };
}
