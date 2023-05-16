import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/config/prisma";

const postsApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;
  if (!slug) res.status(400).json({ message: "Bad Request" });
  else if (req.method === "GET") {
    try {
      const post = await prisma.post.findUnique({
        where: {
          slug: slug as string,
        },
      });
      res.status(200).json(post);
    } catch (e) {
      res.status(500).json({ message: "Post Get Error", error: e });
    }
  }
  res.end();
};

export default postsApi;
