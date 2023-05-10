import { Center, Loader } from "@mantine/core";
import Head from "next/head";
import router from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo } from "react";

type Props = {
  children: React.ReactElement;
};
export const AuthGuard: React.FC<Props> = ({ children }) => {
  const { data, status } = useSession();

  const loader = useMemo(
    () => (
      <>
        <Head>
          <title>Loading...</title>
        </Head>
        <Center sx={{ width: "100%", height: "100%" }}>
          <Loader size="lg" />
        </Center>
      </>
    ),
    []
  );
  useEffect(() => {
    if (router.pathname === "/auth/signin") return;
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, data]);

  if (status === "authenticated") return children;
  return loader;
};
