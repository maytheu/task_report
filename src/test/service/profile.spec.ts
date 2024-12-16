import mongoose from "mongoose";
import ProfileService from "../../service/Profile.service";
import User from "../../model/user.model";
import Role from "../../model/role.model";

jest.mock("../../model/user.model");

const mockedUser = jest.mocked(User);

describe.only("Profile test suite", () => {
  describe("profile", () => {
    const sut = ProfileService.profile;
    const actual = "userId";
    it("Should return error if mongo id is invalid", async () => {
      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(false);

      const expected = await sut(actual);

      expect(expected!.toString()).toBe("Error: User cannot be found");
    });

    it("Should return user profile", async () => {
      const mockUser = { id: "userid", name: "test user" };

      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(true);
      mockedUser.findById = jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValueOnce(Promise.resolve(mockUser)),
      }));

      const expected: any = await sut(actual);

      expect(expected).toEqual(mockUser);
    });
  });

  describe("users", () => {
    const sut = ProfileService.users;
    const paginate = { page: 1, limit: 10 };

    it("Should return all users", async () => {
      const mockUsers = [
        { id: "user1", name: "Test 1" },
        { id: "user2", name: "Test 2" },
      ];
      const mockCount = 2;

      jest.spyOn(User, "countDocuments").mockResolvedValueOnce(mockCount);
      mockedUser.find = jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          skip: jest.fn().mockImplementation(() => ({
            limit: jest.fn().mockResolvedValueOnce(Promise.resolve(mockUsers)),
          })),
        })),
      }));

      const expected = await sut(paginate);

      expect(expected.total).toBe(mockCount);
      expect(expected.users).toEqual(mockUsers);
    });
  });

  describe("assignRole()", () => {
    const sut = ProfileService.assignRole;
    const actual = "userid";
    it("Should return error for invalid mongoid", async () => {
      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(false);

      const expected = await sut(actual, "manager");

      expect(expected!.toString()).toBe("Error: User cannot be found");
    });

    it("Should return roles already assign to user", async () => {
      const mockUserRoles = { roles: [{ name: "manager" }] };

      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(true);
      mockedUser.findById = jest.fn().mockImplementation(() => ({
        populate: jest
          .fn()
          .mockResolvedValueOnce(Promise.resolve(mockUserRoles)),
      }));

      const expected = await sut(actual, "manager");

      expect(expected).toBe("Roles already assign to user");
    });

    it("Should return role id not found", async () => {
      const mockUserRoles = { roles: [{ name: "manager" }] };

      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(true);
      mockedUser.findById = jest.fn().mockImplementation(() => ({
        populate: jest
          .fn()
          .mockResolvedValueOnce(Promise.resolve(mockUserRoles)),
      }));
      jest.spyOn(Role, "findOne").mockResolvedValueOnce(null);

      const expected = await sut(actual, "admin");

      expect(expected!.toString()).toBe("Error: Role cannot be found");
    });

    it("Should update user role", async () => {
      const mockUserRoles = { roles: [{ name: "manager" }], save: jest.fn() };

      jest.spyOn(mongoose, "isValidObjectId").mockReturnValueOnce(true);
      mockedUser.findById = jest.fn().mockImplementation(() => ({
        populate: jest
          .fn()
          .mockResolvedValueOnce(Promise.resolve(mockUserRoles)),
      }));
      jest.spyOn(Role, "findOne").mockResolvedValueOnce({ id: "roleid" });

      await sut(actual, "admin");

      expect(mockUserRoles.save).toHaveBeenCalled(); 
    });
  });
});
