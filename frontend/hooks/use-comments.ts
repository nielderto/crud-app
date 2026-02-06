"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
    postId: number;
    parentId: string | null;
    author: { name: string | null; username: string | null };
    replies?: Comment[];
}

export type { Comment };

export function useComments(postId: string | number) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/comments/post/${postId}`, {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setComments(data.comments || []);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const addComment = async (content: string, parentId?: string) => {
        const res = await fetch(`http://localhost:3001/api/comments/post/${postId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ content, parentId }),
        });

        if (res.ok) {
            await fetchComments();
            return true;
        }
        return false;
    };

    const deleteComment = async (commentId: string) => {
        const res = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (res.ok) {
            await fetchComments();
            return true;
        }
        return false;
    };

    return { comments, loading, addComment, deleteComment };
}
