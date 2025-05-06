import { verifyIfUserIsAdmin } from "../../middlewares/isAdminAuthMiddleware";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { Response, NextFunction } from "express";

describe("verifyIfUserIsAdmin middleware", () => {
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

  it("deve retornar 403 se o usuário não for admin", () => {
    const req = {
      user: { id: 1, isAdmin: false },
    } as AuthenticatedRequest;
    const res = mockResponse();

    verifyIfUserIsAdmin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Acesso negado: administradores apenas" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve chamar next() se o usuário for admin", () => {
    const req = {
      user: { id: 1, isAdmin: true },
    } as AuthenticatedRequest;
    const res = mockResponse();

    verifyIfUserIsAdmin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});