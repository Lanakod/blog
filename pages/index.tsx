import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Container,
  Group,
  Image,
  SimpleGrid,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import Head from "next/head";
import { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsBookmarkFill, BsShareFill } from "react-icons/bs";

import { CustomNextPage } from "@/types/dts";

const mockdata = [
  {
    category: "decorations",
    footer: "733 people liked this",
    author: {
      name: "Elsa Gardenowl",
      description: "posted 34 minutes ago",
      image:
        "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    },
    title: "Top 10 places to visit in Norway this summer",
    image:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    date: "August 18, 2022",
  },
  {
    category: "decorations",
    footer: "733 people liked this",
    author: {
      name: "Elsa Gardenowl",
      description: "posted 34 minutes ago",
      image:
        "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    },
    title: "Best forests to visit in North America",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    date: "August 27, 2022",
  },
  {
    category: "decorations",
    footer: "733 people liked this",
    author: {
      name: "Elsa Gardenowl",
      description: "posted 34 minutes ago",
      image:
        "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    },
    title: "Hawaii beaches review: better than you think",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    date: "September 9, 2022",
  },
  {
    category: "decorations",
    footer: "733 people liked this",
    author: {
      name: "Elsa Gardenowl",
      description: "posted 34 minutes ago",
      image:
        "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    },
    title: "Mountains at night: 12 best locations to enjoy the view",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    date: "September 12, 2022",
  },
];

const Home: CustomNextPage = () => {
  const theme = useMantineTheme();
  const cards = useMemo(
    () =>
      mockdata.map((article) => (
        <Card
          key={article.title}
          withBorder
          padding="lg"
          radius="md"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          })}
        >
          <Card.Section mb="sm">
            <Image src={article.image} alt={article.title} height={180} />
          </Card.Section>

          <Badge>{article.category}</Badge>

          <Text fw={700} mt="xs">
            {article.title}
          </Text>
          <Text
            color="dimmed"
            size="xs"
            transform="uppercase"
            weight={700}
            mt="md"
          >
            {article.date}
          </Text>

          <Group mt="lg">
            <Avatar src={article.author.image} radius="sm" />
            <div>
              <Text fw={500}>{article.author.name}</Text>
              <Text fz="xs" c="dimmed">
                {article.author.description}
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
              <Text fz="xs" c="dimmed">
                {article.footer}
              </Text>
              <Group spacing={0}>
                <ActionIcon>
                  <AiFillHeart size="1.2rem" color={theme.colors.red[6]} />
                </ActionIcon>
                <ActionIcon>
                  <BsBookmarkFill
                    size="1.2rem"
                    color={theme.colors.yellow[6]}
                  />
                </ActionIcon>
                <ActionIcon>
                  <BsShareFill size="1.2rem" color={theme.colors.blue[6]} />
                </ActionIcon>
              </Group>
            </Group>
          </Card.Section>
        </Card>
      )),
    [mockdata]
  );
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container py="xl">
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
          {cards}
        </SimpleGrid>
      </Container>
    </>
  );
};
export default Home;
