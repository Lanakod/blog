import { ServerResponse } from "http";

import { Center, Loader } from "@mantine/core";
import { NextPageContext } from "next";
import Head from "next/head";
import router from "next/router";
import React, { useMemo } from "react";

function Error() {
  return useMemo(
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
}

const navigate = async (location: string, res?: ServerResponse) => {
  if (res) {
    res.writeHead(302, {
      location,
    });
    res.end();
  } else await router.push(location);
};

Error.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  if (!statusCode) {
    await navigate("/", res);
  } else {
    if (statusCode >= 500) await navigate("/500", res);
    if (statusCode >= 400 && statusCode <= 500) await navigate("/404", res);
  }
  return {};
};

export default Error;
