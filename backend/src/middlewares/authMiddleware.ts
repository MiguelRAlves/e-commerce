import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwtPayload";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Não autenticado" });
        return;
    }
    const token = authHeader.split(" ")[1];

    const isTokenRevoked = await prisma.revokedToken.findUnique({ where: { token } });
    if (isTokenRevoked) {
        res.status(401).json({ message: 'Token inválido.' });
        return;
    }


    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        (req as AuthenticatedRequest).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado" });
        return;
    }
}