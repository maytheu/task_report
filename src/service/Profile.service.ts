import mongoose from "mongoose";
import { notFound } from "../controller/globalError";
import { RoleType } from "../model/user.types";
import User from "../model/user.model";
import Role from "../model/role.model";

interface Pagination {
  page: number;
  limit: number;
}

class ProfileService {
  profile = async (userId: string) => {
    if (!mongoose.isValidObjectId(userId)) return notFound("User");
    return await User.findById(userId, "-password").populate({
      path: "roles",
      select: "-_id -__v",
    });
  };

  users = async (paginate: Pagination) => {
    const skip = (paginate.page - 1) * paginate.limit;

    const totalUser = await User.countDocuments();
    const users = await User.find({}, '-password')
      .populate({
        path: "roles",
        select: "-_id -__v",
      })
      .skip(skip)
      .limit(paginate.limit);

    return {
      users,
      total: totalUser,
      page: paginate.page,
      limit: paginate.limit,
    };
  };

  assignRole = async (userId: string, role: RoleType) => {
    if (!mongoose.isValidObjectId(userId)) return notFound("User");

    const user = await User.findById(userId, "roles").populate("roles");

    const userRoles = user?.roles.map((role: any) => role.name);

    if (userRoles?.includes(role)) {
      return "Roles already assign to user";
    } else {
      const roleId = await Role.findOne({ name: role }, "id");
      if (!roleId) return notFound("Role");
      user?.roles.push(roleId.id);
      await user!.save();
    }
  };
}

export default new ProfileService();
