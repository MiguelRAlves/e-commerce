import { Request } from "express";
import { JwtPayload } from "./jwtPayload";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
