import { HelpOutline } from "@mui/icons-material";
import { AppBar, Button, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectLocale, setLocale } from "features/locale-slice";
import strings from "localization/strings";
import React from "react";
import { Content, Root } from "styled/layouts/app-layout";
import theme from "theme";

/**
 * App layout component
 *
 * @param props component properties
 */
const AppLayout: React.FC = ({ children }) => {
  const { locale } = useAppSelector(selectLocale);

  const dispatch = useAppDispatch();

  /**
   * Renders language selection
   */
  const renderLanguageSelection = () => (
    <Stack direction="row" alignItems="center">
      <Button
        variant="text"
        color="secondary"
        onClick={ () => dispatch(setLocale("fi")) }
      >
        <Typography sx={ locale === "fi" ? { fontWeight: 600 } : {}}>{strings.header.languages.fi}</Typography>
      </Button>
      <Typography>|</Typography>
      <Button
        variant="text"
        color="secondary"
        onClick={ () => dispatch(setLocale("en")) }
      >
        <Typography sx={ locale === "en" ? { fontWeight: 600 } : {}}>{strings.header.languages.en}</Typography>
      </Button>
    </Stack>
  );

  /**
   * Renders title
   */
  const renderTitle = () => (
    <Stack
      direction="row"
      alignItems="center"
      spacing={4}
      onClick={ () => window.location.reload() }
      style={{ cursor: "pointer" }}
    >
      <Typography variant="h3" sx={{ fontWeight: 600 }}>{strings.header.icon}</Typography>
      <Typography variant="h3" sx={{ fontWeight: 600 }}>{strings.header.title }</Typography>
    </Stack>
  );

  /**
   * Renders info
   */
  const renderInfo = () => (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
    >
      {renderLanguageSelection()}
      <Tooltip title={<Typography variant="h5">{strings.header.infoText}</Typography>} >
        <HelpOutline/>
      </Tooltip>
    </Stack>
  );

  return (
    <Root>
      <AppBar sx={{ backgroundColor: theme.palette.primary.main }} position="fixed">
        <Toolbar sx={{ width: "100%" }}>
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {renderTitle()}
            {renderInfo()}
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar/>
      <Content>
        { children }
      </Content>
    </Root>
  );
};

export default AppLayout;