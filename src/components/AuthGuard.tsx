import React, { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Center, Loader } from "@mantine/core";
import Head from "next/head";

type Props = {
  children: React.ReactElement;
};
export const AuthGuard: React.FC<Props> = ({ children }) => {
  const { data, status } = useSession();
  const router = useRouter();
  const loader = useMemo(
    () => (
      <>
        <Head>
          <title>Loading...</title>
        </Head>
        <Center sx={{ width: "100vw", height: "100vh" }}>
          <Loader size="lg" />
        </Center>
      </>
    ),
    []
  );
  useEffect(() => {
    if (status === "unauthenticated" && router.pathname !== "/auth/signin")
      router.push("/auth/signin");
  }, [status, data]);

  if (status === "authenticated") return children;
  return loader;
};
