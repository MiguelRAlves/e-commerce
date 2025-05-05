import { Request, Response } from "express";
import { signUpUser, signInUser } from "../services/authService";

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