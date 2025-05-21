import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/useAuthStore";
import styles from "./Auth.module.scss";

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

  const setUser = useAuthStore(state => state.setUser);

  const onSubmit = async (data: SigninFormData) => {
    try {
      const response = await api.post("/auth/signin", data);
      const token = response.data.token;

      setToken(token);

      const userResponse = await api.get("/auth/me");
      setUser(userResponse.data);

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

  const handleClick = () => navigate("/signup");

  return (
    <div className={styles.Container}>
      <div className={styles.FormContainer}>
        <h2>Login</h2>
        <form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.InputContainer}>
            <label htmlFor="email">E-mail</label>
            <input id="email" className={styles.Input}
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

          <div className={styles.InputContainer}>
            <label htmlFor="password">Senha</label>
            <input id="password" className={styles.Input}
              type="password"
              {...register("password", {
                required: "Senha é obrigatória",
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <button className={styles.FormButton} type="submit">Entrar</button>
        </form>
        <span>Ainda não possui uma conta? <a className={styles.SwitchAuthPages} onClick={handleClick}>Clique aqui</a></span>
      </div>
    </div>
  );
}