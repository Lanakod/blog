import {
  Button,
  Center,
  Container,
  Group,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import Head from "next/head";

const useStyles = createStyles((theme) => ({
  root: {
    // paddingTop: rem(80),
    // paddingBottom: rem(80),
    height: "100%",
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: rem(220),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(120),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(540),
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}));

export default function ServerError() {
  const { classes } = useStyles();

  return (
    <>
      <Head>
        <title>Server Error</title>
      </Head>
      <Center className={classes.root}>
        <Container>
          <div className={classes.label}>500</div>
          <Title className={classes.title}>
            Something bad just happened...
          </Title>
          <Text
            color="dimmed"
            size="lg"
            align="center"
            className={classes.description}
          >
            Our servers could not handle your request. Don&apos;t worry, our
            development team was already notified.
          </Text>
          <Group position="center">
            <Button variant="outline" size="md">
              Take me back to home page
            </Button>
          </Group>
        </Container>
      </Center>
    </>
  );
}
