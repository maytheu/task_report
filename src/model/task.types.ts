import { z } from "zod";

const NewTaskDTO = z
  .object({
    details: z.string(),
    hours: z.number(),
    department: z.string(),
  })
  .strict();

const UpdateTaskDTO = z
  .object({
    details: z.string().optional(),
    hours: z.number().optional(),
    department: z.string().optional(),
  })
  .strict();

const Task = z.object({
  edited: z.boolean(),
  name: z.string(),
  approved: z.boolean(),
  comment: z.string(),
});

const ITask = Task.merge(NewTaskDTO);

type ITask = z.infer<typeof ITask>;
type ITaskInput = z.infer<typeof NewTaskDTO>;

export { ITask, ITaskInput, NewTaskDTO, UpdateTaskDTO };
