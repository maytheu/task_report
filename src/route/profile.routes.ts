import { Router } from "express";
import ProfileController from "../controller/Profile.controller";
import { authorization } from "../controller/authenticate";

const profileRouter = Router();

profileRouter.get("/", ProfileController.profile);
profileRouter.get("/users", authorization(["admin", 'manager']), ProfileController.users);
profileRouter.post(
  "/assign",
  authorization(["admin"]),
  ProfileController.assignRole
);

export default profileRouter;
