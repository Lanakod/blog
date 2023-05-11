import { Button } from "@mantine/core";
import Head from "next/head";
import { signOut } from "next-auth/react";
import React from "react";

import { CustomNextPage } from "@/types/dts";

const Settings: CustomNextPage = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <div>
        <Button
          onClick={async () => {
            await signOut({ redirect: false });
          }}
        >
          Sign Out
        </Button>
      </div>
    </>
  );
};

export default Settings;
Settings.requireAuth = true;
