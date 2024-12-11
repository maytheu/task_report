import { Router } from "express";
import TaskController from "../controller/Task.controller";
import { authorization } from "../controller/authenticate";

const taskRouter = Router();

taskRouter.post("/new", TaskController.newTask);
taskRouter.get(
  "/tasks",
  authorization(["admin", "manager"]),
  TaskController.allTasks
);
taskRouter.get("/", TaskController.userTasks);
taskRouter.put(
  "/approve/:id",
  authorization(["admin", "manager"]),
  TaskController.approveTask
);
taskRouter
  .route("/:id")
  .get(TaskController.task)
  .put(TaskController.updateTask);

export default taskRouter;
