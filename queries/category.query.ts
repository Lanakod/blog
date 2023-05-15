import { useMutation, useQuery } from "react-query";

import { axios } from "@/config";
import { CreatePost, type GetPosts } from "@/types";

const getCategories = async (): Promise<GetPosts[]> => {
  const { data } = await axios.get("/posts");
  return data;
};

const postCategory = async (props: CreatePost) => {
  const { data } = await axios.post("/posts", props);
  return data;
};

export const useGetCategories = () => useQuery(["posts"], getCategories);
export const usePostCategory = () => useMutation(["posts"], postCategory);
