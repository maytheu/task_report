import { z } from "zod";

const RoleDTO = z.object({
  name: z.string(),
  userId: z.string(),
});

const ApproveDTO = z.object({
  comment: z.string(),
  approved: z.boolean(),
});

export { ApproveDTO, RoleDTO };
