import Head from "next/head";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { CustomNextPage } from "@types";

const Home: CustomNextPage = () => {
  const { data, status } = useSession();
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {data?.user ? (
          <p>Hello, {data?.user?.name}!</p>
        ) : (
          <Link href="/auth/signin">Sign In</Link>
        )}
        {status === "authenticated" && (
          <button onClick={() => signOut()}>Sign Out</button>
        )}
        <Link href="/categories">Protected page</Link>
      </main>
    </>
  );
};
export default Home;

Home.requireAuth = true;
