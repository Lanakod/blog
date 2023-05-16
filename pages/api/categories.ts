import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/config/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { CreateCategorySchema } from "@/types";

const categoriesApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "POST") {
    if (!session || !session.user) {
      res.status(401).json({ message: "Unauthorized" });
      res.end();
      return;
    }
    const { name, color } = req.body;
    const response = CreateCategorySchema.safeParse(req.body);
    if (!response.success) {
      res.status(400).json({ message: response.error.issues });
    }
    try {
      const category = await prisma.category.create({
        data: {
          name,
          color,
        },
      });
      res.status(201).json(category);
    } catch (e) {
      res.status(500).json({ message: "Category Create Error", error: e });
    }
  } else if (req.method === "GET") {
    try {
      const categories = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          color: true,
        },
      });
      res.status(200).json(categories);
    } catch (e) {
      res.status(500).json({ message: "Categories Get Error", error: e });
    }
  }
  res.end();
};

export default categoriesApi;
