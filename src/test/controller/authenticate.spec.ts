import "dotenv/config";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { authenticate, authorization } from "../../controller/authenticate";
import {
  unauthenticatedError,
  unauthorizedError,
} from "../../controller/globalError";
import jwt from "jsonwebtoken";
import User from "../../model/user.model";

jest.mock("jsonwebtoken");
jest.mock("../../model/user.model");

const mockedJwt = jest.mocked(jwt);
const mockedUser = jest.mocked(User);

describe.only("Authentiicate test suite", () => {
  let req: any, res: Response, next: NextFunction;

  beforeEach(() => {
    req = {
      query: {},
      get: jest.fn(),
      params: {},
      //   user: {},
      headers: {},
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticate", () => {
    const sut: RequestHandler = authenticate;
    it("Should return error if authorization is no added", async () => {
      await sut(req, res, next);

      expect(next).toHaveBeenCalledWith(unauthenticatedError());
    });

    it("Should return unatuehticated error if token is not pass to earer", async () => {
      req.headers.authorization = "Bearer";

      await sut(req, res, next);

      expect(next).toHaveBeenCalledWith(unauthenticatedError());
    });

    it("Should return unauthenticated error if jwt can't verify", async () => {
      req.headers.authorization = "Bearer verify";

      (mockedJwt.verify as jest.Mock).mockResolvedValueOnce(null);

      await sut(req, res, next);

      expect(next).toHaveBeenCalledWith(unauthenticatedError());
    });

    it("Should return userid in req", async () => {
      req.headers.authorization = "Bearer verify";

      (mockedJwt.verify as jest.Mock).mockResolvedValueOnce({ user: "userid" });

      await sut(req, res, next);

      expect(req.user).toBe("userid");
      expect(next).toHaveBeenCalled();
    });

    it("should retun erro in catch {}", async () => {
      const error = new Error("Error occured");
      req.headers.authorization = "Bearer verify";

      (mockedJwt.verify as jest.Mock).mockRejectedValueOnce(error);

      await sut(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("Authorization", () => {
    const sut = authorization;
    it("Should return unathorise if user not found", async () => {
      mockedUser.findById = jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValueOnce(Promise.resolve(null)),
      }));

      const expected = sut(["manager"]);
      await expected(req, res, next);

      expect(next).toHaveBeenCalledWith(unauthorizedError());
    });

    it("Should return unathorise if user is not assiign to tole", async () => {
      const mockUser = { roles: [{ name: "manager" }] };

      mockedUser.findById = jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValueOnce(Promise.resolve(mockUser)),
      }));

      const expected = sut(["manager"]);
      await expected(req, res, next);

      expect(next).toHaveBeenCalledWith(unauthorizedError());
    });

    it("Should authorize user", async () => {
      const mockUser = { roles: [{ name: "admin" }] };

      mockedUser.findById = jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValueOnce(Promise.resolve(mockUser)),
      }));

      const expected = sut(["manager"]);
      await expected(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("Should return error in catch{}", async () => {
      const error = new Error("Error occured");

      mockedUser.findById = jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockRejectedValueOnce(error),
      }));

      const expected = sut(["manager"]);
      await expected(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
