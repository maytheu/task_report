import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "user" },
    name: { type: String, required: true },
    details: { type: String, required: true },
    department: { type: String, required: true },
    hours: { type: Number, required: true },
    edited: { type: Boolean, default: false },
    approved: { type: Boolean },
    comment: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Task = model("task", taskSchema);

export default Task;
