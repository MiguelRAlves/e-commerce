import { render, screen, fireEvent } from "@testing-library/react";
import Signin from "../../pages/Signin";
import { BrowserRouter } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/useAuthStore";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));


jest.mock("../../services/api");
const mockedApi = api as jest.Mocked<typeof api>;

const setTokenMock = jest.fn();
jest.mock("../../store/useAuthStore", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));

const renderSignin = () =>
    render(
        <BrowserRouter>
            <Signin />
        </BrowserRouter>
    );

describe("Signin Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useAuthStore as unknown as jest.Mock).mockReturnValue({
            setToken: setTokenMock,
        });
    });

    it("deve renderizar todos os campos corretamente", () => {
        renderSignin();

        expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
        expect(screen.getByText(/ainda não possui uma conta/i)).toBeInTheDocument();
    });

    it("deve exibir erro ao deixar campos em branco", async () => {
        renderSignin();

        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

        expect(await screen.findByText(/e-mail é obrigatório/i)).toBeInTheDocument();
        expect(await screen.findByText(/senha é obrigatória/i)).toBeInTheDocument();
    });


    it("deve exibir erro vindo da API", async () => {
        mockedApi.post.mockRejectedValue({
            isAxiosError: true,
            response: {
                data: { error: "Credenciais inválidas" },
            },
        });

        renderSignin();

        fireEvent.input(screen.getByLabelText(/e-mail/i), {
            target: { value: "user@email.com" },
        });
        fireEvent.input(screen.getByLabelText(/senha/i), {
            target: { value: "123456" },
        });

        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

        await screen.findByRole("button", { name: /entrar/i });

        expect(toast.error).toHaveBeenCalledWith("Credenciais inválidas");
    });
});