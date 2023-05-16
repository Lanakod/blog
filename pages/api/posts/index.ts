import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/config/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { CreatePostSchema } from "@/types";

const postsApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "POST") {
    if (!session || !session.user) {
      res.status(401).json({ message: "Unauthorized" });
      res.end();
      return;
    }
    const { title, content, categoryId, slug } = req.body;
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
          slug,
          authorId: session.user.id,
        },
      });
      res.status(201).json(post);
    } catch (e) {
      res.status(500).json({ message: "Post Create Error", error: e });
    }
  } else if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({
        select: {
          image: true,
          category: true,
          content: true,
          title: true,
          id: true,
          slug: true,
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
      res.status(500).json({ message: "Posts Get Error", error: e });
    }
  }
  res.end();
};

export default postsApi;
