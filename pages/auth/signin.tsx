import { Button, Center, Group, Stack, Text, Title } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import { FaDiscord, FaGithub, FaGitlab, FaGoogle } from "react-icons/fa";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

type Props = {
  // TODO: Remove ANY and make typescript happy
  providers: any;
};

const getIcon = (id: string) => {
  if (id === "google") return <FaGoogle />;
  if (id === "github") return <FaGithub />;
  if (id === "gitlab") return <FaGitlab />;
  if (id === "discord") return <FaDiscord />;
  else return null;
};

export default function SignIn({ providers }: Props) {
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Center
        sx={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <Stack spacing="xl">
          <Title align="center">Welcome to my Blog</Title>

          {/*  TODO: Remove ANY and make typescript happy*/}
          {Object.values(providers).map((provider: any) => {
            return (
              <Button
                key={provider.id}
                onClick={() => signIn(provider.id)}
                size="lg"
                sx={{ alignSelf: "center" }}
              >
                <Group>
                  <Text size="md">Sign in with {provider.name}</Text>
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
