import { createEmotionCache } from "@mantine/core";

export const cache = createEmotionCache({
  key: "mantine",
  prepend: true,
  stylisPlugins: [],
});
