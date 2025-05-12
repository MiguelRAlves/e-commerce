import { Request, Response } from "express";
import { signUpUser, signInUser } from "../services/authService";
import { prisma } from "../lib/prisma";

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