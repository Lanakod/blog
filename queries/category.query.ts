import { useMutation, useQuery } from "react-query";

import { axios } from "@/config";
import { CreateCategory, GetCategory } from "@/types";

const getCategories = async (): Promise<GetCategory[]> => {
  const { data } = await axios.get("/categories");
  return data;
};

const createCategory = async (props: CreateCategory) => {
  const { data } = await axios.post("/categories", props);
  return data;
};

export const useGetCategories = () => useQuery(["categories"], getCategories);
export const useCreateCategory = () =>
  useMutation(["categories"], createCategory);
