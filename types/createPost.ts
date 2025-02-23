import { z } from "zod";
export const CreatePostSchema = z.object({
  title: z
    .string()
    .min(10, { message: "Минимальная длина названия 10 символов" }),
  content: z
    .string()
    .min(50, { message: "Минимальная длина текста 50 символов" }),
  categoryId: z.string().nonempty(),
  slug: z.string(),
  image: z.string().min(1, { message: "Выберите изображение" }),
});

export type CreatePost = z.infer<typeof CreatePostSchema>;
