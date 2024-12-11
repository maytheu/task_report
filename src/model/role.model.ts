import { Schema, model } from "mongoose";

const roleSchema = new Schema({
  name: { type: String, required: [true, "Role Name is required"] },
});

const Role = model("role", roleSchema);

export default Role;
