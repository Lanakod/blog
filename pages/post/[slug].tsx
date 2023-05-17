import styled from "@emotion/styled";
import {
  Avatar,
  Blockquote,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Skeleton,
  Text,
  TextInput,
  Title,
  TypographyStylesProvider,
  createStyles,
  rem,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Prism } from "@mantine/prism";
import { Interweave, NodeConfig } from "interweave";
import moment from "moment/moment";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { ReactNode } from "react";

import { queryClient } from "@/pages/_app";
import { useCreateComment, useGetComments, useGetPostBySlug } from "@/queries";
import { CreateCommentSchema } from "@/types";
import { CustomNextPage } from "@/types/dts";

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.colors.blue[5]};
  &:hover {
    color: ${(props) => props.theme.colors.blue[4]};
  }
`;

function Transform(
  node: HTMLElement,
  children: ReactNode[],
  config: NodeConfig
): React.ReactNode {
  switch (node.tagName.toLowerCase()) {
    case "code": {
      const code =
        children
          .filter((c) => typeof c === "string")
          .reduce((result, item) => {
            return `${result}\n${item}`;
          }) || "";
      return (
        <Prism
          withLineNumbers
          language="tsx"
          sx={(theme) => ({
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
            borderRadius: theme.radius.sm,
          })}
        >
          {code as string}
        </Prism>
      );
    }
    case "a":
      return (
        <StyledLink href={node.getAttribute("href") || "/"} target="_blank">
          {children}
        </StyledLink>
      );
    case "blockquote":
      return <Blockquote>{children}</Blockquote>;
    case "p":
      return <Text mih="1rem">{children}</Text>;
    case "h1":
      return <Title order={2}>{children}</Title>;
    case "h2":
      return <Title order={3}>{children}</Title>;
    case "h3":
      return <Title order={4}>{children}</Title>;
    case "h4":
      return <Title order={5}>{children}</Title>;
    case "hr":
      return <Divider my="sm" />;
  }
}

const useStyles = createStyles({
  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
});

const PostPage: CustomNextPage = () => {
  const { data: session } = useSession();
  const { classes } = useStyles();
  const createCommentForm = useForm({
    validate: zodResolver(CreateCommentSchema),
    initialValues: {
      content: "",
    },
  });

  const router = useRouter();
  const { data: post, isLoading: postLoading } = useGetPostBySlug(
    router.query.slug as string
  );
  const { data: comments, isLoading: commentsLoading } = useGetComments(
    post?.id
  );
  const { mutate: createComment, isLoading: createCommentLoading } =
    useCreateComment();

  return (
    <>
      <Head>
        <title>{postLoading ? "Загрузка" : post?.title}</title>
      </Head>
      <main>
        {/*  Title  */}
        <Skeleton mb="3rem" visible={postLoading}>
          <Title order={1}>{post?.title}</Title>
        </Skeleton>
        <Skeleton
          visible={postLoading}
          height={postLoading ? 750 : "fit-content"}
        >
          <Interweave transform={Transform} content={post?.content} />
        </Skeleton>
        <Divider my="1rem" />

        {session ? (
          <form
            onSubmit={createCommentForm.onSubmit(
              (values) => {
                if (!post) return;
                createComment(
                  { data: values, postId: post.id },
                  {
                    onSuccess: async () => {
                      await queryClient.refetchQueries(["comments"]);
                    },
                    onError: async (e) => {
                      console.log(e);
                    },
                  }
                );
              },
              (errors, values) => {
                console.log(errors, values);
              }
            )}
          >
            <LoadingOverlay
              visible={createCommentLoading ?? false}
              transitionDuration={500}
            />

            <TextInput
              sx={{
                width: "100%",
              }}
              placeholder="Ваш комментарий"
              label="Комментарий"
              withAsterisk
              mb="1rem"
              {...createCommentForm.getInputProps("content")}
            />
            <Button mb="1rem" type="submit">
              Создать
            </Button>
          </form>
        ) : null}

        <Text size="lg" weight={500}>
          Комментарии:
        </Text>

        <Skeleton mb="3rem" visible={commentsLoading}>
          {comments?.length ? (
            comments
              ?.sort(
                (a, b) =>
                  moment(b.updatedAt).unix() - moment(a.updatedAt).unix()
              )
              ?.map((c, i) => (
                <Paper
                  key={c.content + i}
                  withBorder
                  radius="md"
                  sx={(theme) => ({
                    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
                    transition: "transform 150ms ease, box-shadow 150ms ease",
                    marginTop: "1rem",

                    "&:hover": {
                      transform: "scale(1.01)",
                      boxShadow: theme.shadows.md,
                    },
                  })}
                >
                  <Group>
                    <Avatar
                      src={c.user.image}
                      alt={c.user.name || ""}
                      radius="xl"
                    />
                    <div>
                      <Text fz="sm">{c.user.name}</Text>
                      <Text fz="xs" c="dimmed">
                        {moment(c.createdAt).locale("ru").format("LLL")}
                      </Text>
                    </div>
                  </Group>
                  <TypographyStylesProvider
                    sx={(theme) => ({
                      paddingLeft: rem(54),
                      paddingTop: theme.spacing.sm,
                      fontSize: theme.fontSizes.sm,
                    })}
                  >
                    <div className={classes.content}>{c.content}</div>
                  </TypographyStylesProvider>
                </Paper>
              ))
          ) : (
            <Paper
              withBorder
              radius="md"
              sx={(theme) => ({
                padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
                transition: "transform 150ms ease, box-shadow 150ms ease",
                marginTop: "1rem",

                "&:hover": {
                  transform: "scale(1.01)",
                  boxShadow: theme.shadows.md,
                },
              })}
            >
              <Text>
                Комментарии отсутсвуют. Станьте первым, кто оставил комментарий!
              </Text>
            </Paper>
          )}
        </Skeleton>
      </main>
    </>
  );
};

export default PostPage;
