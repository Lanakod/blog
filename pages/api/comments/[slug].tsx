import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/config/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { CreateCommentSchema } from "@/types";

const commentsApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  const { slug: postId } = req.query;
  if (!postId || typeof postId !== "string")
    res.status(400).json({ message: "Bad Request" });
  else if (req.method === "GET") {
    try {
      const post = await prisma.comment.findMany({
        where: {
          post: {
            id: postId,
          },
        },
        select: {
          id: true,
          user: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.status(200).json(post);
    } catch (e) {
      res.status(500).json({ message: "Comments Get Error", error: e });
    }
  } else if (req.method === "POST") {
    if (!session || !session.user) {
      res.status(401).json({ message: "Unauthorized" });
      res.end();
      return;
    }
    const { content } = req.body;
    const response = CreateCommentSchema.safeParse(req.body);
    if (!response.success) {
      res.status(400).json({ message: response.error.issues });
    }
    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          userId: session.user.id,
          postId,
        },
      });
      res.status(201).json(comment);
    } catch (e) {
      res.status(500).json({ message: "Comment Create Error", error: e });
    }
  }
  res.end();
};

export default commentsApi;
