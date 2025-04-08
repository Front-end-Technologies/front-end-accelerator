import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: { dark: true, light: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  palette: {
    error: {
      main: red.A400,
    },
    primary: {
      main: "#09c",
    },
    secondary: {
      main: "#555",
    },
  },
});

export default theme;
