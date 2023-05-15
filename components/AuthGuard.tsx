import { Center, Loader } from "@mantine/core";
import { Role } from "@prisma/client";
import Head from "next/head";
import router from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
  children: React.ReactElement;
  role?: Role[];
};
export const AuthGuard: React.FC<Props> = ({ children, role }) => {
  const { data, status } = useSession();
  const [timedOut, setTimedOut] = useState(false);
  const [unauthorized, setUnauthorized] = useState(true);
  useMemo(() => setTimeout(() => setTimedOut(true), 1000), []);

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
    if (router.pathname === "/auth/signin") {
      console.log("A");
      setUnauthorized(false);
      return;
    }
    if (status === "unauthenticated") {
      console.log("B");
      setTimeout(() => router.push("/auth/signin"), 1000);
      return;
    }

    if (status === "authenticated") {
      if (data?.user?.role === "ADMIN") {
        setUnauthorized(false);
        return;
      }
      if (!role || role.includes("READER")) {
        console.log("C");
        setUnauthorized(false);
        return;
      } else if (data?.user?.role) {
        if (role.includes(data.user.role)) {
          console.log("D");
          setUnauthorized(false);
          return;
        } else {
          console.log("E");
          setTimeout(() => router.push("/"), 1000);
          return;
        }
      } else {
        console.log("F");
        setTimeout(() => router.push("/"), 1000);
        return;
      }
    }
  }, [status, data, role]);

  if (status === "authenticated" && timedOut && !unauthorized) return children;
  return loader;
};
