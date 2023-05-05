import React, { FC } from "react";
import { CustomNextPage } from "@types";

const Categories: CustomNextPage = () => {
  return (
    <main>
      <p>Protected Page</p>
    </main>
  );
};

export default Categories;
Categories.requireAuth = true;
