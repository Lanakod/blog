import React, { FC } from "react";
import { CustomNextPage } from "@types";
import Head from "next/head";

const Categories: CustomNextPage = () => {
  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>
      <main>
        <p>Protected Page</p>
      </main>
    </>
  );
};

export default Categories;
Categories.requireAuth = true;
