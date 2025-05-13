// src/pages/Signup.tsx
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

type SignupFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function Signup() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupFormData>();

    const navigate = useNavigate();
    const onSubmit = async (data: SignupFormData) => {
        const { name, email, password } = data;
        try {
            await api.post("/auth/signup", {
                name,
                email,
                password,
            });
            toast.success("Cadastro realizado com sucesso!");
            setTimeout(() => {
                navigate("/signin");
            }, 1000)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data?.message || error.message);
            } else { toast.error("Erro desconhecido"); }
        }
    };

    const password = watch("password");

    return (
        <div>
            <h2>Cadastro</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Nome</label>
                    <input {...register("name", { required: "Nome é obrigatório" })} />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>

                <div>
                    <label>E-mail</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "E-mail é obrigatório",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "E-mail inválido",
                            },
                        })}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                <div>
                    <label>Senha</label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Senha é obrigatória",
                            minLength: {
                                value: 6,
                                message: "A senha precisa de pelo menos 6 caracteres",
                            },
                        })}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>

                <div>
                    <label>Confirmar Senha</label>
                    <input
                        type="password"
                        {...register("confirmPassword", {
                            required: "Confirme sua senha",
                            validate: (value) =>
                                value === password || "As senhas não coincidem",
                        })}
                    />
                    {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
                </div>


                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}