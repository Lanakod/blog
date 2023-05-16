import "@/styles/globals.scss";
import {
  ColorScheme,
  ColorSchemeProvider,
  Global,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { Role } from "@prisma/client";
import { DevSupport } from "@react-buddy/ide-toolbox-next";
import { NextComponentType } from "next";
import NextApp, { AppContext, AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import nookies from "nookies";
import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { AuthGuard, PageLayout, RouterTransition } from "@/components";
import { ComponentPreviews, useInitial } from "@/components/dev";

export type CustomAppProps = AppProps & {
  Component: NextComponentType & {
    requireAuth?: boolean | Role[];
  };
  colorScheme?: ColorScheme;
};
export const queryClient = new QueryClient();

export default function App({
  Component,
  colorScheme,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const preferredColorScheme = useColorScheme();
  const [_colorScheme, setColorScheme] = useState<ColorScheme>(
    colorScheme || preferredColorScheme
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (_colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    nookies.set(null, "color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "strict",
    });
  };

  const component = useMemo(
    () => (
      <DevSupport
        ComponentPreviews={ComponentPreviews}
        useInitialHook={useInitial}
      >
        <Component {...pageProps} />
      </DevSupport>
    ),
    [Component]
  );

  const getSecuredPage = () => {
    if (Array.isArray(Component.requireAuth)) {
      return <AuthGuard role={Component.requireAuth}>{component}</AuthGuard>;
    }
    return <AuthGuard>{component}</AuthGuard>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={_colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: _colorScheme,
            fontFamily: "Montserrat, sans-serif",
            transitionTimingFunction: "ease-in-out",
          }}
        >
          <SessionProvider
            session={session}
            refetchInterval={5 * 60}
            refetchOnWindowFocus
          >
            <RouterTransition />
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
            <PageLayout>
              {Component.requireAuth ? getSecuredPage() : component}
            </PageLayout>

            <ReactQueryDevtools position="bottom-right" />
          </SessionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  let colorScheme: ColorScheme | null = null;
  const cookies = nookies.get(appContext.ctx);
  if (cookies["color-scheme"])
    colorScheme = cookies["color-scheme"] as ColorScheme;
  return {
    ...appProps,
    colorScheme: colorScheme || "light",
  };
};
