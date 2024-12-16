import TaskService from "../../service/Task.service";
import User from "../../model/user.model";
import Task from "../../model/task.model";
import { ITaskInput } from "../../model/task.types";
import mongoose from "mongoose";

jest.mock("../../model/user.model");
jest.mock("../../model/task.model");

const mockedUser = jest.mocked(User);
const mockedTask = jest.mocked(Task);

describe("Test suite for task report", () => {
  describe("newTask", () => {
    const sut = TaskService.newTask;
    it("Should create new task", async () => {
      const actual: ITaskInput = {
        department: "It",
        details: "Test task",
        hours: 4,
      };
      const mockTask = {
        ...actual,
        name: "test name",
        user: "userId",
        save: jest.fn(),
      };

      mockedUser.findById.mockResolvedValueOnce({ name: "test user" });
      mockedTask.mockImplementationOnce(() => mockTask as any);

      await sut("userId", actual);

      expect(mockTask.save).toHaveBeenCalled();
    });
  });

  describe("tasks", () => {
    const sut = TaskService.tasks;
    it("Should return all data without filtering", async () => {
      const paginate = { page: 1, limit: 10 };
      const mockTasks = [
        { name: "Task 1", department: "HR", hour: "2", createdAt: new Date() },
        { name: "Task 2", department: "IT", hour: "3", createdAt: new Date() },
      ];
      const mockCount = 2;

      mockedTask.countDocuments.mockResolvedValueOnce(mockCount);
      mockedTask.find = jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockImplementation(() => ({
          skip: jest.fn().mockResolvedValueOnce(Promise.resolve(mockTasks)),
        })),
      }));

      const expected: any = await sut({}, paginate);

      expect(expected.total).toBe(mockCount);
      expect(expected.tasks).toEqual(mockTasks);
    });

    it("Should return  data after filtering ", async () => {
      const paginate = { page: 1, limit: 10 };
      const mockTasks = [
        { name: "Task 1", department: "HR", hour: "2", createdAt: new Date() },
      ];
      const mockCount = 1;

      mockedTask.countDocuments.mockResolvedValueOnce(mockCount);
      mockedTask.find = jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockImplementation(() => ({
          skip: jest.fn().mockResolvedValueOnce(Promise.resolve(mockTasks)),
        })),
      }));

      const expected: any = await sut(
        { name: "Task 1", details: "test details", department: "test" },
        paginate,
        false,
        "userid"
      );

      expect(expected.total).toBe(mockCount);
      expect(expected.tasks).toEqual(mockTasks);
    });

    it("Should return response in string ormat for excel", async () => {
      const paginate = { page: 1, limit: 10 };
      const mockTasks = [
        { name: "Task 1", department: "HR", hour: "2", createdAt: new Date() },
      ];

      mockedTask.find.mockResolvedValueOnce(mockTasks);

      await sut({}, paginate, true);

      expect(mockedTask.find).toHaveBeenCalledWith({}, "-user -__v");
    });
  });

  describe("task", () => {
    const sut = TaskService.task;
    const actual = "taskId";
    it("Should return not found error if mongoose id is invalid", async () => {
      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(false);

      const expected = await sut(actual);

      expect(expected.toString()).toBe("Error: Task cannot be found");
    });

    it("Should return not foun error if taskid is not found", async () => {
      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(true);
      mockedTask.findById.mockResolvedValueOnce(null);

      const expected = await sut(actual);

      expect(expected.toString()).toBe("Error: Task cannot be found");
    });

    it("Should return task bby id", async () => {
      const mockTask = { id: "taskId", details: "test task", hours: 5 };

      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(true);
      mockedTask.findById.mockResolvedValueOnce(mockTask);

      const expected = await sut(actual);

      expect(expected).toEqual(mockTask);
    });
  });

  describe("updateTask", () => {
    const sut = TaskService.updateTask;
    const actual: ITaskInput = {
      department: "Hr",
      details: "Test task",
      hours: 4,
    };
    const taskId = "taskId";
    const userId = "userId";
    it("Should return error with invalid mongoose id", async () => {
      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(false);

      const expected = await sut(taskId, userId, actual);

      expect(expected?.toString()).toBe("Error: Report cannot be found");
    });

    it("Should return error if task not found or cannot update after 24 hours", async () => {
      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(true);
      mockedTask.findOne.mockResolvedValueOnce(null);

      const expected = await sut(taskId, userId, actual);

      expect(expected?.toString()).toBe("Error: Report cannot be updated");
    });

    it("Should update task", async () => {
      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(true);
      mockedTask.findOne.mockResolvedValueOnce(actual);

      await sut(taskId, userId, actual);

      expect(mockedTask.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe("approveTask", () => {
    const sut = TaskService.approveTask;
    const taskId = "taskId";
    const data = { comment: "Good test", approved: true };
    it("Should return error for invalid mongoose id", async () => {
      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(false);

      const expected = await sut(taskId, data);

      expect(expected?.toString()).toBe("Error: Report cannot be found");
    });

    it("Should update task with approve status", async () => {
      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(true);

      await sut(taskId, data);

      expect(mockedTask.findByIdAndUpdate).toHaveBeenCalled();
    });
  });
});
