import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Image,
  MantineTheme,
  Text,
  rem,
} from "@mantine/core";
import moment from "moment";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsBookmarkFill, BsShareFill } from "react-icons/bs";

import { GetPosts } from "@/types";

type Props = {
  post: GetPosts;
  theme: MantineTheme;
};
export const PostCard: FC<Props> = ({ post, theme }) => {
  const router = useRouter();
  return (
    <Card
      withBorder
      padding="lg"
      radius="md"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        transition: "transform 150ms ease, box-shadow 150ms ease",

        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: theme.shadows.md,
        },
      })}
    >
      <Card.Section mb="sm">
        <Image src={post.image} alt={post.title} height={180} />
      </Card.Section>

      <Badge
        sx={{
          background: `${post.category.color}20`,
          color: post.category.color,
        }}
      >
        {post.category.name}
      </Badge>

      <Text fw={700} mt="xs">
        {post.title}
      </Text>

      <Group mt="lg">
        <Avatar src={post.author.image} radius="xl" />
        <div>
          <Text fw={500}>{post.author.name}</Text>
          <Text fz="xs" c="dimmed">
            {moment(post.createdAt).locale("ru").format("LL")}
          </Text>
        </div>
      </Group>

      <Card.Section
        sx={(theme) => ({
          padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
          marginTop: theme.spacing.md,
          borderTop: `${rem(1)} solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[2]
          }`,
        })}
      >
        <Group position="apart">
          <Group spacing={0}>
            <ActionIcon>
              <AiFillHeart size="1.2rem" color={theme.colors.red[6]} />
            </ActionIcon>
            <ActionIcon>
              <BsBookmarkFill size="1.2rem" color={theme.colors.yellow[6]} />
            </ActionIcon>
            <ActionIcon>
              <BsShareFill size="1.2rem" color={theme.colors.blue[6]} />
            </ActionIcon>
          </Group>
          <Button
            variant="light"
            onClick={async () => await router.push(`/post/${post.slug}`)}
          >
            Читать
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
};
