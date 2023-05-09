import Head from "next/head";
import React from "react";

import { CustomNextPage } from "@types";

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
