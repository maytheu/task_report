import { RequestHandler } from "express";
import AppController from "./App.controller";
import { LoginDTO, RegisterDTO } from "../model/user.types";
import AuthService from "../service/Auth.service";
import AppError from "../config/AppError";

class AuthController extends AppController {
  login: RequestHandler = async (req, res, next) => {
    try {
      await LoginDTO.parse(req.body);

      const token = await AuthService.login(req.body);
      if (token instanceof AppError) return next(token);

      this.sendResp(res, "Login successfull", { token });
    } catch (error) {
      next(error);
    }
  };

  register: RequestHandler = async (req, res, next) => {
    try {
      await RegisterDTO.parse(req.body);

      const data = await AuthService.register(req.body);
      if (data instanceof AppError) return next(data);

      this.sendCreatedResp(res, "Account created", data);
    } catch (error) {
      next(error);
    }
  };

}

export default new AuthController();
