import {
  Category,
  Post,
  User,
  UserPostBookmarks,
  UserPostLikes,
} from "@prisma/client";

// export type CategoryProduct = Product & { date: Date[] };

export interface GetPosts {
  id: Post["id"];
  title: Post["title"];
  content: Post["content"];
  image: Post["image"];
  slug: Post["slug"];
  category: {
    name: Category["name"];
    color: Category["color"];
  };
  author: {
    name: User["name"];
    image: User["image"];
  };
  likes: UserPostLikes[];
  bookmarks: UserPostBookmarks[];
  createdAt: Post["createdAt"];
  updatedAt: Post["updatedAt"];
}
