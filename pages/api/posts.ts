import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/config/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { CreatePostSchema } from "@/types";

const postCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user)
    res.status(401).json({ message: "Unauthorized" });
  else if (req.method === "POST") {
    const { title, content, categoryId } = req.body;
    const response = CreatePostSchema.safeParse(req.body);
    if (!response.success) {
      res.status(400).json({ message: response.error.issues });
    }
    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          categoryId,
          authorId: session.user.id,
        },
      });
      res.status(201).json(post);
    } catch (e) {
      res.status(500).json({ message: "Post Create Error" });
    }
  }
  if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({
        select: {
          image: true,
          category: true,
          content: true,
          title: true,
          id: true,
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
      res.status(200).json(posts);
    } catch (e) {
      res.status(500).json({ message: "Index Get Error", error: e });
    }
  }
  res.end();
};

export default postCategory;
