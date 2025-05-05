import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { Response, NextFunction } from "express";

export const verifyIfUserIsAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user?.isAdmin) {
        res.status(403).json({ message: "Acesso negado: administradores apenas" });
        return;
    }
    next();
}