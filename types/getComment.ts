import { Comment, User } from "@prisma/client";

export interface GetComment {
  id: Comment["id"];
  user: User;
  content: Comment["content"];
  createdAt: Comment["createdAt"];
  updatedAt: Comment["updatedAt"];
}
