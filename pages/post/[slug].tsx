import styled from "@emotion/styled";
import { Blockquote, Divider, Skeleton, Text, Title } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { Interweave, NodeConfig } from "interweave";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { useGetPostBySlug } from "@/queries";
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

const PostPage: CustomNextPage = () => {
  const router = useRouter();
  const { data: post, isLoading } = useGetPostBySlug(
    router.query.slug as string
  );
  return (
    <>
      <Head>
        <title>{isLoading ? "Загрузка" : post?.title}</title>
      </Head>
      <main>
        {/*  Title  */}
        <Skeleton mb="3rem" visible={isLoading}>
          <Title order={1}>{post?.title}</Title>
        </Skeleton>
        <Skeleton visible={isLoading} height={750}>
          <Interweave transform={Transform} content={post?.content} />
        </Skeleton>
      </main>
    </>
  );
};

export default PostPage;
