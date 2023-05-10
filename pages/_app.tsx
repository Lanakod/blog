import "@/styles/globals.scss";
import {
  ColorScheme,
  ColorSchemeProvider,
  Global,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { NextComponentType } from "next";
import NextApp, { AppContext, AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import nookies from "nookies";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

// import { cache } from "@/cache";
import { AuthGuard, PageLayout, RouterTransition } from "@/components";

export type CustomAppProps = AppProps & {
  Component: NextComponentType & {
    requireAuth?: boolean;
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
              {Component.requireAuth ? (
                <AuthGuard>
                  <Component {...pageProps} />
                </AuthGuard>
              ) : (
                <Component {...pageProps} />
              )}
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
