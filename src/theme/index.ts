import { createTheme } from "@mui/material";
import { darkPalette, lightPalette } from "./palette";
import { shadows } from "./shadows";
import { transitions } from "./transitions";
import { zIndex } from "./zIndex";
import { components } from "./components";
import { typography } from "./typography";

export const getTheme = (themeMode: "dark" | "light") => {
  const colors = themeMode === "dark" ? darkPalette : lightPalette

  const themeOptions = {
    palette: colors,
    typography: typography(colors),
    shadows: shadows(colors),
    transitions: transitions,
    zIndex: zIndex,
    shape: {
      borderRadius: 8,
    },
  }

  const themes = createTheme(themeOptions);
  themes.components = components(themes);

  return themes
}
