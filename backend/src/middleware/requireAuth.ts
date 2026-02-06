import { auth } from "../lib/auth";
import type { Request, Response, NextFunction } from "express";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
        headers: req.headers,
    });

    if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    res.locals.session = session;
    next();
};
