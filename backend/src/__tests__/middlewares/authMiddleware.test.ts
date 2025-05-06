import { authenticateUser } from "../../middlewares/authMiddleware";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

jest.mock("jsonwebtoken");

describe("authenticateUser middleware", () => {
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    return res;
  };

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 401 se o header de autorização estiver ausente", () => {
    const req = { headers: {} } as Request;
    const res = mockResponse();

    authenticateUser(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Não autenticado" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve retornar 401 se o token for inválido", () => {
    const req = {
      headers: { authorization: "Bearer token_invalido" },
    } as Request;
    const res = mockResponse();

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Token inválido");
    });

    authenticateUser(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token inválido ou expirado" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve adicionar o usuário ao req e chamar next() se o token for válido", () => {
    const decoded = { id: 1, email: "user@example.com", isAdmin: false };
    const req = {
      headers: { authorization: "Bearer token_valido" },
    } as Request;
    const res = mockResponse();

    (jwt.verify as jest.Mock).mockReturnValue(decoded);

    authenticateUser(req, res, mockNext);

    expect(req.user).toEqual(decoded);
    expect(mockNext).toHaveBeenCalled();
  });
});