import Router from "express";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import type { Request, Response, NextFunction } from "express";

export const PostRoute = Router();

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    
    res.locals.session = session;

    next();
}

PostRoute.get("/", requireAuth, async (req, res) => {
    try {
        const search = req.query.search as string | undefined;

        const posts = await prisma.post.findMany({
            where: {
                ...(search && {
                    title: {
                        contains: search,
                        mode: "insensitive" as const,
                    },
                }),
            },
            include: { author: { select: { name: true, username: true } } },
            orderBy: { id: "desc" },
        })

        res.status(200).json({
            message: posts.length > 0 ? "Posts fetched successfully" : "No posts found",
            posts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

PostRoute.post("/", requireAuth, async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;

        if (!title) {
            res.status(400).json({ error: "Title is required" });
            return;
        }

        const post = await prisma.post.create({
            data: { title, content, authorId: res.locals.session.user.id },
        })

        res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

PostRoute.put("/:id", requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        
        if (!title) {
            res.status(400).json({ error: "Title is required" });
            return;
        }

        const existing = await prisma.post.findUnique({
            where: {id: Number(id)}
        })
    
        if (!existing || existing.authorId !== res.locals.session.user.id) {
            res.status(404).json({ error: "Post not found" });
            return;
        }
    
        const post = await prisma.post.update({
            where: { id: Number(id) },
            data: { title, content },
        })

        res.status(200).json({
            message: "Post updated successfully",
            post,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

PostRoute.get("/:id", requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: { author: { select: { name: true, username: true } } },
        });

        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        res.status(200).json({ message: "Post fetched successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

PostRoute.delete("/:id", requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const existing = await prisma.post.findUnique({
            where: { id: Number(id) },
        })

        if (!existing || existing.authorId !== res.locals.session.user.id) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        const post = await prisma.post.delete({
            where: { id: Number(id) },
        })

        res.status(200).json({
            message: "Post deleted successfully",
            post,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
