import {
  Avatar,
  Box,
  Group,
  MantineNumberSize,
  Navbar,
  Switch,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Role } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { Dispatch, FC, SetStateAction, useMemo } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { BsBox, BsMoonStars, BsSun } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { GoArchive } from "react-icons/go";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { TbClipboardList } from "react-icons/tb";

type Props = {
  setOpened: Dispatch<SetStateAction<boolean>>;
  opened: boolean;
  hiddenBreakpoint: MantineNumberSize;
};

type MainLinkProps = {
  icon: React.ReactElement;
  color: string;
  label: string;
  pageLink: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
};

const MainLink: FC<MainLinkProps> = ({
  pageLink,
  color,
  label,
  icon,
  setOpened,
}) => {
  const { pathname } = useRouter();
  return (
    <Link href={pageLink} passHref>
      <UnstyledButton
        onClick={() => setOpened(false)}
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          backgroundColor:
            pathname === pageLink
              ? theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0]
              : "transparent",
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>
          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
};

interface NavBarLink extends Omit<MainLinkProps, "setOpened"> {
  role?: Role[];
}

const data: NavBarLink[] = [
  {
    pageLink: "/",
    label: "Главная",
    color: "blue",
    icon: <AiOutlineHome size={18} />,
  },
  {
    pageLink: "/posts",
    label: "Посты",
    color: "teal",
    icon: <BiCategory size={18} />,
    role: ["WRITER"],
  },
  {
    pageLink: "/categories",
    label: "Категории",
    color: "violet",
    icon: <BsBox size={16} />,
    role: ["WRITER"],
  },
  {
    pageLink: "/products",
    label: "Products",
    color: "grape",
    icon: <TbClipboardList size={20} />,
    role: ["WRITER"],
  },
  {
    pageLink: "/settings",
    label: "Настройки",
    color: "orange",
    icon: <FiSettings size={16} />,
  },
];

const Brand: FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Box
      sx={(theme) => ({
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
        paddingBottom: theme.spacing.lg,
        borderBottom: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[2]
        }`,
      })}
    >
      <Group position="apart" align="center">
        <Group>
          <ThemeIcon
            variant="gradient"
            gradient={{
              from: "indigo",
              to: "cyan",
            }}
            size="lg"
            radius="lg"
          >
            <GoArchive size={18} />
          </ThemeIcon>
          <Title
            size="1.2rem"
            weight={400}
            sx={{
              fontStyle: "italic",
            }}
          >
            Inventory
          </Title>
        </Group>
        <Switch
          checked={colorScheme === "dark"}
          onChange={() => toggleColorScheme()}
          size="md"
          onLabel={<BsSun size={18} />}
          offLabel={<BsMoonStars size={18} />}
        />
        {/*<ActionIcon*/}
        {/*  variant="default"*/}
        {/*  size={30}*/}
        {/*  onClick={() => toggleColorScheme()}*/}
        {/*>*/}
        {/*  {colorScheme === "dark" ? (*/}
        {/*    <BsSun size={18} />*/}
        {/*  ) : (*/}
        {/*    <BsMoonStars size={18} />*/}
        {/*  )}*/}
        {/*</ActionIcon>*/}
      </Group>
    </Box>
  );
};

const getWordInitials = (word: string): string => {
  const bits = word.trim().split(" ");
  return bits
    .map((bit) => bit.charAt(0))
    .join("")
    .toUpperCase();
};

const User: FC = () => {
  const theme = useMantineTheme();
  const { data: session } = useSession();
  const { pathname } = useRouter();

  const href = useMemo(() => {
    if (!session) return "/auth/signin";
    return pathname === "/settings" ? "/" : "/settings";
  }, [pathname, session]);

  return (
    <Link href={href} passHref>
      <Box
        sx={{
          paddingTop: theme.spacing.sm,
          borderTop: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
        }}
      >
        <UnstyledButton
          sx={{
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          }}
        >
          <Group>
            {/* Avatar */}
            <Avatar
              src={session?.user?.image}
              radius="xl"
              color="blue"
              variant="light"
            >
              {`${getWordInitials(session?.user?.name ?? "")}`}
            </Avatar>
            {!session ? (
              <Text weight={500}>Войти</Text>
            ) : (
              <>
                {/*  Info  */}
                <Box sx={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {session?.user?.name}
                  </Text>
                  <Text color="dimmed" size="xs">
                    {session?.user?.email}
                  </Text>
                </Box>
                {/*  Icon  */}
                {pathname === "/settings" ? (
                  <MdKeyboardArrowLeft size={18} />
                ) : (
                  <MdKeyboardArrowRight size={18} />
                )}
              </>
            )}
          </Group>
        </UnstyledButton>
      </Box>
    </Link>
  );
};

export const NavBar: FC<Props> = ({ setOpened, opened, hiddenBreakpoint }) => {
  const { data: userData } = useSession();
  return (
    <Navbar
      p="xs"
      width={{ sm: 300 }}
      hiddenBreakpoint={hiddenBreakpoint}
      hidden={!opened}
    >
      <Navbar.Section mt="xs">
        <Brand />
      </Navbar.Section>
      <Navbar.Section grow mt="md">
        {data.map((item) => {
          const link = (
            <MainLink {...item} key={item.label} setOpened={setOpened} />
          );
          if (userData) {
            if (userData?.user?.role === "ADMIN") return link;
            if (
              userData?.user?.role &&
              item.role?.includes(userData.user.role)
            ) {
              return link;
            }
            if (!item.role || item.role.includes("READER")) return link;
          } else if (!item.role || item.role.includes("READER")) return link;
        })}
      </Navbar.Section>
      <Navbar.Section>
        <User />
      </Navbar.Section>
    </Navbar>
  );
};
