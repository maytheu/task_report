import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { unauthenticatedError, unauthorizedError } from "./globalError";
import { env } from "../config/validate";
import User from "../model/user.model";
import { RoleType } from "../model/user.types";

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer"))
      return next(unauthenticatedError());

    const token = header.split(" ")[1];
    if (!token) return next(unauthenticatedError());

    const decode: any = await jwt.verify(token, env.JWT_SECRET);
    if (!decode) return next(unauthenticatedError());

    req.user = decode.user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorization = (roles: RoleType[]) => {  
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user).populate("roles");
      if (!user) {
        return next(unauthorizedError());
      }

      const userRoles = user.roles.map((role: any) => role.name);
      if (roles.some((role) => userRoles.includes(role))) {
        next();
      } else {
        return next(unauthorizedError());
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
};
