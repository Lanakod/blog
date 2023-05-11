import { Role } from "@prisma/client";
import { NextPage } from "next";
export type CustomNextPage<P = object, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean | Role[];
};
