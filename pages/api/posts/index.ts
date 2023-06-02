import * as fs from "fs";
import path from "path";

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/config/prisma";
import { env } from "@/env.mjs";
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
    const { title, content, categoryId, slug, image } = req.body;
    const response = CreatePostSchema.safeParse(req.body);
    if (!response.success) {
      res.status(400).json({ message: response.error.issues });
    }
    try {
      if (!fs.existsSync(path.resolve(env.FILES_SAVE_DIR))) {
        fs.mkdirSync(path.resolve(env.FILES_SAVE_DIR));
      }
      let imageWritten = "";
      if (image) {
        const imagePath = path.resolve(env.FILES_SAVE_DIR, slug);
        fs.writeFileSync(imagePath, image, {});
        if (fs.existsSync(imagePath)) imageWritten = imagePath;
      }
      const post = await prisma.post.create({
        data: {
          title,
          content,
          categoryId,
          slug,
          image: imageWritten ? imageWritten : null,
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
          comments: true,
          bookmarks: true,
          likes: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const responsePosts = posts.map((post) => {
        if (post.image) {
          if (!fs.existsSync(path.resolve(env.FILES_SAVE_DIR, post.slug)))
            return post;
          const image = fs.readFileSync(
            path.resolve(env.FILES_SAVE_DIR, post.slug),
            {
              encoding: "utf8",
            }
          );
          return { ...post, image };
        } else return post;
      });
      res.status(200).json(responsePosts);
    } catch (e) {
      res.status(500).json({ message: "Posts Get Error", error: e });
    }
  }
  res.end();
};

export default postsApi;
