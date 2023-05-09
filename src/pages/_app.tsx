import "@/styles/globals.scss";
import {
  ColorScheme,
  ColorSchemeProvider,
  Global,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { getCookie, setCookie } from "cookies-next";
import type { NextComponentType } from "next";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

import { AuthGuard, PageLayout } from "@/components";

import { cache } from "../../cache";

export type CustomAppProps = AppProps & {
  Component: NextComponentType & {
    requireAuth?: boolean;
  };
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const cookieTheme = getCookie("mantine-color-scheme");
    if (cookieTheme) return cookieTheme as ColorScheme;
    return preferredColorScheme;
  });
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "strict",
    });
  };
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        emotionCache={cache}
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: colorScheme,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <SessionProvider
          session={session}
          refetchInterval={5 * 60}
          refetchOnWindowFocus
        >
          <Global
            styles={(theme) => ({
              a: {
                textDecoration: "none",
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.black,
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[0]
                      : theme.black,
                },
              },
            })}
          />
          {Component.requireAuth ? (
            <AuthGuard>
              <PageLayout>
                <Component {...pageProps} />
              </PageLayout>
            </AuthGuard>
          ) : (
            <Component {...pageProps} />
          )}
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
