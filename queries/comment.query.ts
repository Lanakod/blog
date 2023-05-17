import { useMutation, useQuery } from "react-query";

import { axios } from "@/config";
import { CreateComment, GetComment } from "@/types";

const getComments = async (postId?: string): Promise<GetComment[]> => {
  if (!postId) return [];
  const { data } = await axios.get(`/comments/${postId}`);
  return data;
};

interface ICreateComment {
  data: CreateComment;
  postId: string;
}

const createComment = async (props: ICreateComment) => {
  const { data } = await axios.post(`/comments/${props.postId}`, props.data);
  return data;
};

export const useGetComments = (postId?: string) =>
  useQuery(["comments"], () => getComments(postId));
export const useCreateComment = () => useMutation(["comments"], createComment);
