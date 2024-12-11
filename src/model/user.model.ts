import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: { type: String, required: true },
  roles: { type: [Types.ObjectId], ref: "role" },
});

const User = model("user", userSchema);

export default User;
