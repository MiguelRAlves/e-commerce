import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { signUpUser, signInUser } from "../services/authService";
import { prisma } from "../lib/prisma";
import rateLimit from 'express-rate-limit';

export const signUpController = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        await signUpUser(name, email, password);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const signInController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await signInUser(email, password);
        res.json({ token });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
}

export const logoutController = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(400).json({ message: "Token ausente." });
        return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(400).json({ message: "Token inválido." });
        return;
    }

    try {
        await prisma.revokedToken.create({
            data: {
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        res.status(200).json({ message: "Logout realizado com sucesso." });
        return
    } catch (error) {
        res.status(500).json({ message: "Erro ao realizar logout." });
        return
    }
};

export const getMeController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "Usuário não autenticado" });
            return
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
            },
        });

        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
        return
    }
};

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Muitas requisições vindas deste IP, tente novamente mais tarde."
});