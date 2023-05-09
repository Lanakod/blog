import React, { FC } from "react";
import { CustomNextPage } from "@types";
import Head from "next/head";

const Settings: CustomNextPage = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <div>Settings</div>
    </>
  );
};

export default Settings;
Settings.requireAuth = true;
