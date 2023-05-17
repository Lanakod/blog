import { z } from "zod";
export const CreateCommentSchema = z.object({
  content: z.string().min(10, { message: "Минимальная длина 10 символов" }),
});

export type CreateComment = z.infer<typeof CreateCommentSchema>;
