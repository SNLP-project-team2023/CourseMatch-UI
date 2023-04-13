import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Styled paper component
 */
export const PaperCard = styled(Paper, {
  label: "main-screen--paper-card"
})(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(2)
}));

/**
 * Styled empty box component
 */
export const EmptyBox = styled(Box, {
  label: "main-screen--empty-box"
})(({ theme }) => ({
  flex: 1,
  width: 700,
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  paddingBottom: theme.spacing(4)
}));