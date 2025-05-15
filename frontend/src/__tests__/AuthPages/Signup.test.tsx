import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../../pages/Signup";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import '@testing-library/jest-dom';

jest.mock("../../services/api");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

function renderSignup() {
  return render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );
}

describe("Signup Page", () => {
  it("deve exibir mensagens de erro nos campos vazios", async () => {
    renderSignup();

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(await screen.findByText("Nome é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("E-mail é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
    expect(screen.getByText("Confirme sua senha")).toBeInTheDocument();
  });

  it("deve exibir erro se as senhas não coincidirem", async () => {
    renderSignup();

    fireEvent.input(screen.getByLabelText(/nome/i), { target: { value: "João" } });
    fireEvent.input(screen.getByLabelText(/e-mail/i), { target: { value: "joao@email.com" } });
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: "123456" } });
    fireEvent.input(screen.getByLabelText(/confirmar senha/i), { target: { value: "654321" } });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(await screen.findByText("As senhas não coincidem")).toBeInTheDocument();
  });

  it("deve enviar dados corretamente se o formulário for válido", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    renderSignup();

    fireEvent.input(screen.getByLabelText(/nome/i), { target: { value: "João" } });
    fireEvent.input(screen.getByLabelText(/e-mail/i), { target: { value: "joao@email.com" } });
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: "123456" } });
    fireEvent.input(screen.getByLabelText(/confirmar senha/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/signup", {
        name: "João",
        email: "joao@email.com",
        password: "123456",
      });
      expect(toast.success).toHaveBeenCalledWith("Cadastro realizado com sucesso!");
    });
  });
});