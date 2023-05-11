import {
  Category,
  Component,
  Palette,
  Variant,
} from "@react-buddy/ide-toolbox-next";
import MantinePalette from "@react-buddy/palette-mantine-core";
import MantinePalette2 from "@react-buddy/palette-mantine-dates";
import MantinePalette1 from "@react-buddy/palette-mantine-form";
import React, { Fragment } from "react";

export const PaletteTree = () => (
  <Palette>
    <Category name="App">
      <Component name="Loader">
        <Variant>
          <ExampleLoaderComponent />
        </Variant>
      </Component>
    </Category>
    <MantinePalette />
    <MantinePalette1 />
    <MantinePalette2 />
  </Palette>
);

export function ExampleLoaderComponent() {
  return <Fragment>Loading...</Fragment>;
}
