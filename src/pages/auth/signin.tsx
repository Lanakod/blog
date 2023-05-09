import { getProviders, signIn } from "next-auth/react";
import { Button, Center, Group, Stack, Text, Title } from "@mantine/core";
import { FaGoogle, FaGithub, FaDiscord, FaGitlab } from "react-icons/fa";
import Head from "next/head";

const getIcon = (id: string) => {
  if (id === "google") return <FaGoogle />;
  if (id === "github") return <FaGithub />;
  if (id === "gitlab") return <FaGitlab />;
  if (id === "discord") return <FaDiscord />;
  else return null;
};

export default function SignIn({ providers }: any) {
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
export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
