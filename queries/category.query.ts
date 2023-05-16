import { useMutation, useQuery } from "react-query";

import { axios } from "@/config";
import { CreateCategory, GetCategories } from "@/types";

const getCategories = async (): Promise<GetCategories[]> => {
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
