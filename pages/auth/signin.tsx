import { Button, Center, Group, Stack, Text, Title } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
} from "next-auth/react";
import {
  FaDiscord,
  FaGithub,
  FaGitlab,
  FaGoogle,
  FaQuestion,
} from "react-icons/fa";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

type Provider = Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>;

type Props = {
  // TODO: Remove ANY and make typescript happy
  providers: Provider | null;
};

const getIcon = (id: ClientSafeProvider["id"]) => {
  switch (id) {
    case "google":
      return <FaGoogle />;
    case "github":
      return <FaGithub />;
    case "gitlab":
      return <FaGitlab />;
    case "discord":
      return <FaDiscord />;
    default:
      return <FaQuestion />;
  }
};

export default function SignIn({ providers }: Props) {
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Center
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Stack spacing="xl">
          <Title align="center">Welcome to my Blog</Title>

          {/*  TODO: Remove ANY and make typescript happy*/}
          {providers &&
            Object.values(providers).map((provider) => {
              return (
                <Button
                  key={provider.id}
                  onClick={() => signIn(provider.id)}
                  size="lg"
                  sx={{ alignSelf: "center" }}
                >
                  <Group>
                    <Text size="md">{provider.name}</Text>
                    {getIcon(provider.id)}
                  </Group>
                </Button>
              );
            })}
        </Stack>
      </Center>
    </>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const providers = await getProviders();
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (session)
    return {
      props: {
        providers,
      },
      redirect: {
        destination: "/",
      },
    };
  return {
    props: { providers },
  };
};
