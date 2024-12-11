import { NextFunction, RequestHandler, Response } from "express";
import AppController from "./App.controller";
import TaskService from "../service/Task.service";
import { NewTaskDTO, UpdateTaskDTO } from "../model/task.types";
import AppError from "../config/AppError";
import { ApproveDTO } from "../model/role.types";

class TaskController extends AppController {
  newTask: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.user;      
      await NewTaskDTO.parse(req.body);

      const data = await TaskService.newTask(userId, req.body);
      if (data instanceof AppError) return next(data);

      this.sendCreatedResp(res, "New task created", data);
    } catch (error) {
      next(error);
    }
  };

  allTasks: RequestHandler = async (req, res, next) => {
    try {
      const paginate = {
        limit: req.query?.limit ? +req.query.limit : 10,
        page: req.query?.page ? +req.query.page : 1,
      };
      const excel = req.query?.excel ? true : false;

      const data = await TaskService.tasks(req.query, paginate, excel);
      if (data instanceof AppError) return next(data);

      if (excel) {
        res.header("Content-Type", "text/csv");
        res.attachment(`tasks-${Date.now()}.csv`);
        return res.send(data);
      }
      this.sendResp(res, "All tasks", data as Object);
    } catch (error) {
      next(error);
    }
  };

  userTasks: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.user;
      const paginate = {
        limit: req.query?.limit ? +req.query.limit : 10,
        page: req.query?.page ? +req.query.page : 1,
      };
      const excel = req.query?.excel ? true : false;

      const data = await TaskService.tasks(
        req.query,
        paginate,
        excel,
        userId
      );
      if (data instanceof AppError) return next(data);

      if (excel) {
        res.header("Content-Type", "text/csv");
        res.attachment(`tasks-${Date.now()}.csv`);
        return res.send(data);
      }
      this.sendResp(res, "All tasks", data as Object);
    } catch (error) {
      next(error);
    }
  };

  task: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await TaskService.task(id);
      if (data instanceof AppError) return next(data);

      this.sendResp(res, "View Task", data);
    } catch (error) {
      next(error);
    }
  };

  updateTask: RequestHandler = async (req, res, next) => {
    try {
      await UpdateTaskDTO.parse(req.body);
      const { id } = req.params;
      const userId = req.user;

      const data = await TaskService.updateTask(id, userId, req.body);
      if (data instanceof AppError) return next(data);

      this.sendResp(res, "Task updated", data as Object);
    } catch (error) {
      next(error);
    }
  };

  approveTask: RequestHandler = async (req, res, next) => {
    try {
      await ApproveDTO.parse(req.body);
      const { id } = req.params;

      const data = await TaskService.approveTask(id, req.body);
      if (data instanceof AppError) return next(data);

      this.sendResp(res, "Task updated", { message: "Task status updated" });
    } catch (error) {
      next(error);
    }
  };
}

export default new TaskController();
