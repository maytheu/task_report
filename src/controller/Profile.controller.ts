import { RequestHandler } from "express";
import AppController from "./App.controller";
import { RoleDTO } from "../model/role.types";
import ProfileService from "../service/Profile.service";
import AppError from "../config/AppError";

class ProfileController extends AppController {
  profile: RequestHandler = async (req, res, next) => {
    try {
      const data = await ProfileService.profile(req.user);
      if (data instanceof AppError) return next(data);

      this.sendCreatedResp(res, "user profile", data as Object);
    } catch (error) {
      next(error);
    }
  };

  users: RequestHandler = async (req, res, next) => {
    try {
      const paginate = {
        limit: req.query?.limit ? +req.query.limit : 10,
        page: req.query?.page ? +req.query.page : 1,
      };

      const data = await ProfileService.users(paginate);
      if (data instanceof AppError) return next(data);

      this.sendCreatedResp(res, "All users", data as Object);
    } catch (error) {
      next(error);
    }
  };
  assignRole: RequestHandler = async (req, res, next) => {
    try {
      await RoleDTO.parse(req.body);

      const data = await ProfileService.assignRole(
        req.body.userId,
        req.body.name
      );
      if (data instanceof AppError) return next(data);

      this.sendCreatedResp(res, "New role assign to user", {});
    } catch (error) {
      next(error);
    }
  };
}

export default new ProfileController()