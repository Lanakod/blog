import { useQuery, useMutation } from "react-query";
import { axios } from "@/config";
import { type GetCategory, PostCategory } from "@/types";

const getCategories = async (): Promise<GetCategory[]> => {
  const { data } = await axios.get("/category");
  return data;
};

const postCategory = async (props: PostCategory) => {
  const { data } = await axios.post("/category", props);
  return data;
};

export const useGetCategories = () => useQuery(["categories"], getCategories);
export const usePostCategory = () =>
  useMutation(["postCategory"], postCategory);
