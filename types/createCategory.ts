import { z } from "zod";
export const CreateCategorySchema = z.object({
  name: z.string().min(2, { message: "Минимальная длина названия 2 символа" }),
  color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
    message: 'Должен быть цветом в формате "#AABBCC"',
  }),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;
