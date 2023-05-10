import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/config/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { PostCategorySchema } from "@/types";

const postCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) res.status(401).json({ message: "Unauthorized" });
  if (req.method === "POST") {
    const { name } = req.body;
    const response = PostCategorySchema.safeParse(req.body);
    if (!response.success) {
      res.status(400).json({ message: response.error.issues });
    }
    try {
      const category = await prisma.category.create({
        data: {
          name,
          userId: session?.user?.id,
        },
      });
      res.status(201).json(category);
    } catch (e) {
      res.status(500).json({ message: "Category Post Error" });
    }
  }
  if (req.method === "GET") {
    try {
      const categories = await prisma.category.findMany({
        where: {
          userId: session?.user?.id,
        },
        select: {
          products: {
            select: {
              name: true,
              price: true,
              id: true,
              lastUpdate: true,
              date: {
                select: {
                  stock: true,
                },
                take: 1,
              },
            },
          },
          name: true,
          id: true,
        },
      });
      res.status(200).json(categories);
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.end();
};

export default postCategory;
