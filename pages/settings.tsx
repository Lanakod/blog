import Head from "next/head";
import React from "react";

import { CustomNextPage } from "@/types/dts";

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
