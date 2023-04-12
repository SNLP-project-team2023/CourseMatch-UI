import React, { useState } from "react";
import { Typography } from "@mui/material";
import strings from "localization/strings";
import AppLayout from "components/layouts/app-layout";
import { SearchMode } from "types";

/**
 * Main screen component
 */
const MainScreen: React.FC = () => {

  const [searchMode, setSearchMode] = useState<SearchMode>(SearchMode.CODE)


  return (
    <AppLayout>
      <Typography>{ strings.generic.notImplemented }</Typography>
    </AppLayout>
  );
};

export default MainScreen;