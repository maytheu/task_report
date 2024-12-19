import "dotenv/config";
import User from "../../model/user.model";
import AuthService from "../../service/Auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Role from "../../model/role.model";

jest.mock("../../model/user.model");
jest.mock("../../model/role.model");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockedUser = jest.mocked(User);
const mockedRole = jest.mocked(Role);
const mockBcrypt = jest.mocked(bcrypt);
const mockedJwt = jest.mocked(jwt);

describe("Test suite for Auth service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("login()", () => {
    const sut = AuthService.login;
    it("Should return error if email not found", async () => {
      const actual = { email: "laue@gmail.com", password: "123456" };

      mockedUser.findOne.mockResolvedValueOnce(null);

      const expected = await sut(actual);

      expect(expected.toString()).toBe("Error: Login credentials do not match");
    });

    it("Should return error if password do not match", async () => {
      const actual = { email: "laue@gmail.com", password: "123456" };

      mockedUser.findOne.mockResolvedValueOnce({ password: "hashed-password" });
      (mockBcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const expected = await sut(actual);

      expect(expected.toString()).toBe("Error: Login credentials do not match");
    });

    it("Should return token if login is succeessfull", async () => {
      const actual = { email: "laue@gmail.com", password: "123456" };

      mockedUser.findOne.mockResolvedValueOnce({
        password: "hashed-password",
        id: "user-id",
      });
      (mockBcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (mockedJwt.sign as jest.Mock).mockResolvedValueOnce("user-token");

      const expected = await sut(actual);

      expect(expected).toBe("user-token");
    });
  });

  describe("register()", () => {
    const sut = AuthService.register;
    it("Should return error if account exist", async () => {
      const actual = {
        email: "laue@gmail.com",
        password: "123456",
        name: "Test user",
      };
      const mockUser = { id: "user-id", name: "user exist" };

      mockedUser.findOne.mockResolvedValueOnce(mockUser);

      const expected = await sut(actual);

      expect(expected.toString()).toBe("Error: Account exist");
    });

    it("Should return error if role is not found", async () => {
      const actual = {
        email: "laue@gmail.com",
        password: "123456",
        name: "Test user",
      };

      mockedUser.findOne.mockResolvedValueOnce(null);
      mockedRole.findOne.mockResolvedValueOnce(null);

      const expected = await sut(actual);

      expect(expected.toString()).toBe("Error: Role cannot be found");
    });

    it("Should register new user", async () => {
      const actual = {
        email: "laue@gmail.com",
        password: "123456",
        name: "Test user",
      };
      const mockUser = {
        ...actual,
        save: jest.fn(),
        roles: [],
      };

      mockedUser.findOne.mockResolvedValueOnce(null);
      mockedRole.findOne.mockResolvedValueOnce({ _id: "role-id" });
      mockedUser.mockImplementationOnce(() => mockUser as any);
      (mockedJwt.sign as jest.Mock).mockResolvedValueOnce("user-token");

      const expected = await sut(actual);

      expect(expected).toEqual({
        token: "user-token",
        user: { name: actual.name, email: actual.email },
      });
    });
  });
});
