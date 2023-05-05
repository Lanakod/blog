import { getProviders, signIn } from "next-auth/react";
import { Button, Center, Group, Stack, Text, Title } from "@mantine/core";
import { FaGoogle } from "react-icons/fa";

export default function SignIn({ providers }: any) {
  return (
    <>
      {Object.values(providers).map((provider: any) => (
        <Center
          key={provider.name}
          sx={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <Stack spacing="xl">
            <Title align="center">Welcome to my Blog</Title>
            {provider.name === "Google" && (
              <Button
                onClick={() => signIn(provider.id)}
                size="lg"
                sx={{ alignSelf: "center" }}
              >
                <Group>
                  <Text size="md">Sign in with {provider.name}</Text>
                  <FaGoogle />
                </Group>
              </Button>
            )}
          </Stack>
        </Center>
      ))}
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
