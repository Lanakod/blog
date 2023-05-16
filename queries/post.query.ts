import { useMutation, useQuery } from "react-query";

import { axios } from "@/config";
import { CreatePost, type GetPosts } from "@/types";
import { generateSlug } from "@/utils";

const getPosts = async (): Promise<GetPosts[]> => {
  const { data } = await axios.get("/posts");
  return data;
};

const getPostBySlug = async (slug: string): Promise<GetPosts> => {
  const { data } = await axios.get(`/posts/${slug}`);
  return data;
};

const createPost = async (props: CreatePost) => {
  const { data } = await axios.post("/posts", {
    ...props,
    slug: generateSlug(props.title),
  });
  return data;
};

export const useGetPosts = () => useQuery(["posts"], getPosts);
export const useGetPostBySlug = (slug: string) =>
  useQuery(["post"], () => getPostBySlug(slug));
export const useCreatePost = () => useMutation(["posts"], createPost);
