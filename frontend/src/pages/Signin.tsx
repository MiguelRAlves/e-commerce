// src/pages/Signin.tsx
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";

type SigninFormData = {
  email: string;
  password: string;
};

export default function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>();

  const setToken = useAuthStore(state => state.setToken);

  const navigate = useNavigate();

  const onSubmit = async (data: SigninFormData) => {
    try {
      const response = await api.post("/auth/signin", data);

      const token = response.data.token;
      setToken(token);

      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || "Erro ao fazer login";
        toast.error(message);
      } else {
        toast.error("Erro desconhecido");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}