import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
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
  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

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
        {/*<Stack spacing="xl">*/}
        {/*  <Title align="center">Welcome to my Blog</Title>*/}

        {/*  /!*  TODO: Remove ANY and make typescript happy*!/*/}
        {/*  {providers &&*/}
        {/*    Object.values(providers).map((provider) => {*/}
        {/*      return (*/}
        {/*        <Button*/}
        {/*          key={provider.id}*/}
        {/*          onClick={() => signIn(provider.id)}*/}
        {/*          size="lg"*/}
        {/*          sx={{ alignSelf: "center" }}*/}
        {/*        >*/}
        {/*          <Group>*/}
        {/*            <Text size="md">{provider.name}</Text>*/}
        {/*            {getIcon(provider.id)}*/}
        {/*          </Group>*/}
        {/*        </Button>*/}
        {/*      );*/}
        {/*    })}*/}
        {/*</Stack>*/}
        <Paper radius="md" p="xl" withBorder>
          <Text size="lg" weight={500}>
            Welcome to Mantine, {type} with
          </Text>

          <SimpleGrid cols={2} mb="md" mt="md">
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
          </SimpleGrid>

          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          />

          <form onSubmit={form.onSubmit(() => {})}>
            <Stack>
              {type === "register" && (
                <TextInput
                  label="Name"
                  placeholder="Your name"
                  value={form.values.name}
                  onChange={(event) =>
                    form.setFieldValue("name", event.currentTarget.value)
                  }
                  radius="md"
                />
              )}

              <TextInput
                required
                label="Email"
                placeholder="hello@mantine.dev"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={
                  form.errors.password &&
                  "Password should include at least 6 characters"
                }
                radius="md"
              />

              {type === "register" && (
                <Checkbox
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  onChange={(event) =>
                    form.setFieldValue("terms", event.currentTarget.checked)
                  }
                />
              )}
            </Stack>

            <Group position="apart" mt="xl">
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                onClick={() => toggle()}
                size="xs"
              >
                {type === "register"
                  ? "Already have an account? Login"
                  : "Don't have an account? Register"}
              </Anchor>
              <Button type="submit" radius="xl">
                {upperFirst(type)}
              </Button>
            </Group>
          </form>
        </Paper>
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
