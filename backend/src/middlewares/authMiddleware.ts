import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwtPayload";

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Não autenticado" });
        return;
    }
    const token = authHeader.split(" ")[1];
    
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado" });
        return;
    }
}