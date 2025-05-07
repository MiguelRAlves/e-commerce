import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

export const signUpUser = async (name: string, email: string, password: string) => {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
        throw new Error('Usuário já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        },
        select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true
        }
    });

    return newUser;
}

export const signInUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Senha inválida');
    }

    const token = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: '1d' }
    )

    return token;
}