import mongoose from "mongoose";
import AppError from "../config/AppError";
import { notFound } from "../controller/globalError";
import Task from "../model/task.model";
import { ITask, ITaskInput } from "../model/task.types";
import User from "../model/user.model";
import { json2csv } from "json-2-csv";

interface Filter {
  department?: string;
  details?: string;
  name?: string;
  daterange?: string;
  hour?: number;
}

interface Pagination {
  page: number;
  limit: number;
}

class TaskService {
  newTask = async (userId: string, data: ITaskInput) => {
    const user = await User.findById(userId, "name");
    const newTaskData = new Task({ ...data, user: userId, name: user!.name });
    return await newTaskData.save();
  };

  tasks = async (
    filter: Filter,
    paginate: Pagination,
    excel = false,
    user?: string
  ) => {
    const query = <any>{};

    if (filter.details) query.name = { $regex: filter.details, $options: "i" };
    if (filter.name) query.name = { $regex: filter.name, $options: "i" };
    if (filter.department)
      query.department = { $regex: filter.department, $options: "i" };
    if (filter.hour) query.hour = { $regex: filter.hour };
    if (filter.daterange) {
      const range = filter.daterange.split("-");
      if (range.length === 1) query.createdAt = { $gte: new Date(range[0]) };
      else
        query.createdAt = {
          $gte: new Date(range[0]),
          $lt: new Date(range[1]).setDate(new Date(range[1]).getDate() + 1),
        };
    }
    if (user) {
      query.user = user;
    }

    const taskCount = await Task.countDocuments(query);

    if (excel) {
      const tasks = await Task.find(query, "-user -__v");
      return this.exportToExcel(tasks as ITask[]);
    }
    const skip = (paginate.page - 1) * paginate.limit;
    const tasks = await Task.find(query, "-user -__v")
      .limit(paginate.limit)
      .skip(skip);

    return {
      tasks,
      total: taskCount,
      page: paginate.page,
      limit: paginate.limit,
    };
  };

  task = async (taskId: string) => {
    if (!mongoose.isValidObjectId(taskId)) return notFound("Task");

    const singleTask = await Task.findById(taskId, "-user");
    if (!singleTask) return notFound("Task");

    return singleTask;
  };

  updateTask = async (taskId: string, userId: string, data: ITaskInput) => {
    if (!mongoose.isValidObjectId(taskId)) return notFound("Report");

    const task = await Task.findOne({
      _id: taskId,
      user: userId,
      createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    });
    if (!task) return new AppError("Report cannot be updated", 403);

    return await Task.findByIdAndUpdate(taskId, data, { new: true });
  };

  approveTask = async (
    taskId: string,
    data: { comment: string; approved: boolean }
  ) => {
    if (!mongoose.isValidObjectId(taskId)) return notFound("Report");

    await Task.findByIdAndUpdate(taskId, data);
  };

  private readonly exportToExcel = (data: ITask[]) => {
    const reportData = data.map((el) => ({
      name: el.name,
      department: el.department,
      hours: el.hours,
      details: el.details,
      edited: el.edited,
      approved: el.approved,
      comment: el.comment,
    }));
    return json2csv(reportData, {});
  };

  // private readonly exportToPdf = (data) => {};
}

export default new TaskService();
