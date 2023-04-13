import React, { useContext, useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, CircularProgress, IconButton, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import strings from "localization/strings";
import AppLayout from "components/layouts/app-layout";
import { SearchMode } from "types";
import { Course, CourseAlias } from "generated/client";
import CourseCard from "components/generic/course-card";
import { ErrorContext } from "components/contexts/error-handler";
import { useApiClient, useDebouncedCall } from "app/hooks";
import Api from "api";
import { Edit, ExpandMore, Search } from "@mui/icons-material";
import { EmptyBox, PaperCard } from "styled/screens/main-screen";
import theme from "theme";

/**
 * Main screen component
 */
const MainScreen: React.FC = () => {
  const [searchMode, setSearchMode] = useState<SearchMode>(SearchMode.CODE);
  const [courseAliases, setCourseAliases] = useState<CourseAlias[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesCode, setCourseCode] = useState("");
  const [queryText, setQueryText] = useState("");
  const [loading, setLoading] = useState(false);

  const errorContext = useContext(ErrorContext);
  const { matchApi, courseApi } = useApiClient(Api.getApiClient);

  /**
   * Fetches course alias
   */
  const fetchCourseAlias = async () => {
    try {
      const fetchedCourseAliases = await courseApi.coursesGet();
      setCourseAliases(fetchedCourseAliases);
    } catch (error) {
      errorContext.setError(strings.errorHandling.course.fetch);
    }
  };

  useEffect(() => {
    fetchCourseAlias();
  }, []);

  /**
   * On course match
   *
   * @param code course code
   */
  const onCourseCodeMatch = async (code: string) => {
    setLoading(true);
    try {
      const fetchedCourses = await matchApi.matchCourseCodeGet({ courseCode: code });
      setCourses(fetchedCourses);
    } catch (error) {
      errorContext.setError(strings.errorHandling.match.fetch);
    }
    setLoading(false);
  };

  /**
   * On course text match
   *
   * @param text query text
   */
  const onCourseTextMatch = async (text: string) => {
    try {
      const fetchedCourses = await matchApi.matchTextGet({ queryText: text });
      setCourses(fetchedCourses);
    } catch (error) {
      errorContext.setError(strings.errorHandling.match.fetch);
    }
    setLoading(false);
  };

  const onCourseTextMatchDebounced = useDebouncedCall<string>(onCourseTextMatch);

  /**
   * On query text change
   *
   * @param newQueryText new query text
   */
  const onQueryTextChange = (newQueryText: string) => {
    setQueryText(newQueryText);
    setLoading(true);
    onCourseTextMatchDebounced(newQueryText);
  };

  /**
   * Render search mode
   */
  const renderSearchMode = () => (
    <ToggleButtonGroup
      color="primary"
      value={searchMode}
      exclusive
    >
      <ToggleButton
        color="primary"
        value="left"
        selected={searchMode === SearchMode.CODE}
        onClick={() => setSearchMode(SearchMode.CODE)}
        sx={{ borderRadius: theme.spacing(2) }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Search/>
          <Typography>{ strings.mainScreen.searchMode.code }</Typography>
        </Stack>
      </ToggleButton>
      <ToggleButton
        value="right"
        selected={searchMode === SearchMode.TEXT}
        onClick={() => setSearchMode(SearchMode.TEXT)}
        sx={{ borderRadius: theme.spacing(2) }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Edit/>
          <Typography>{ strings.mainScreen.searchMode.text }</Typography>
        </Stack>
      </ToggleButton>
    </ToggleButtonGroup>
  );

  /**
   * Renders code search
   */
  const renderCodeSearch = () => {
    const courseOptions = courseAliases.map(alias => ({ label: alias.code, name: `${alias.code} ${alias.name}` }));

    return (
      <Stack
        spacing={2}
        component="form"
        direction="row"
        width="100%"
      >
        <Autocomplete
          fullWidth
          disablePortal
          options={courseOptions}
          inputValue={coursesCode}
          /* eslint-disable @typescript-eslint/no-unused-vars */
          renderOption={(props, option, _) => (<Typography noWrap {...props}>{option.name}</Typography>)}
          onInputChange={(_, newInputValue) => setCourseCode(newInputValue)}
          renderInput={params =>
            <TextField
              {...params}
              variant="outlined"
              name="courseCode"
              label={strings.mainScreen.courseCode}
            />}
        />
        <IconButton
          color="primary"
          type="submit"
          disabled={loading}
          onClick={() => onCourseCodeMatch(coursesCode)}
        >
          <Search/>
        </IconButton>
      </Stack>
    );
  };

  /**
   * Renders text search
   */
  const renderTextSearch = () => (
    <TextField
      fullWidth
      multiline
      rows={6}
      value={queryText}
      variant="outlined"
      label={strings.mainScreen.courseQueryText}
      onChange={({ target }) => onQueryTextChange(target.value)}
    />
  );

  /**
   * Renders more options
   */
  const renderMoreOptions = () => (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore/>}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{strings.mainScreen.moreOptions}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{strings.generic.notImplemented}</Typography>
      </AccordionDetails>
    </Accordion>
  );

  /**
   * Renders search
   */
  const renderSearch = () => (
    <PaperCard elevation={6} sx={{ width: 650 }}>
      <Stack
        direction="column"
        alignItems="center"
        width="100%"
        spacing={2}
        padding={2}
      >
        {renderSearchMode()}
        {searchMode === SearchMode.CODE ? renderCodeSearch() : renderTextSearch()}
        <Box sx={{ width: "100%" }}>
          {renderMoreOptions()}
        </Box>
      </Stack>
    </PaperCard>
  );

  /**
   * Renders empty result
   */
  const renderEmptyResult = () => (
    <EmptyBox>
      <Stack alignItems="center" spacing={1} color="rgba(0,0,0,0.6)">
        <Search fontSize="large"/>
        <Typography variant="h3">{strings.mainScreen.matchYourCourses}</Typography>
      </Stack>
    </EmptyBox>
  );

  /**
   * Renders courses
   */
  const renderCourses = () => (
    <Stack spacing={3}>
      {courses.map(course => <CourseCard course={course}/>)}
    </Stack>
  );

  /**
   * Renders loading
   */
  const renderLoading = () => (
    <EmptyBox>
      <CircularProgress size={48}/>
    </EmptyBox>
  );

  /**
   * Renders search results
   */
  const renderSearchResults = () => {
    if (loading) {
      return renderLoading();
    }

    return courses.length <= 0 ? renderEmptyResult() : renderCourses();
  };

  return (
    <AppLayout>
      <Stack
        direction="column"
        alignItems="center"
        spacing={4}
        paddingTop={4}
        sx={{ overflow: "auto", flex: 1 }}
      >
        {renderSearch()}
        {renderSearchResults()}
      </Stack>
    </AppLayout>
  );
};

export default MainScreen;