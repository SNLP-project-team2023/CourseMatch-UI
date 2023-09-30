import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

/**
 * Styled root component
 */
export const Root = styled(Box, {
  label: "app-layout--root"
})(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default
}));

/**
 * Styled content component
 */
export const Content = styled(Box, {
  label: "app-layout--content"
})(({ theme }) => ({
  flex: 1,
  minHeight: `calc(100vh - ${theme.spacing(64)}px)`,
  width: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "rgba(218,219,205,0.1)"
}));