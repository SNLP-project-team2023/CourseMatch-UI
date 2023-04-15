import React, { useRef, useContext, useEffect, useState } from "react";
import { Pagination, Button, Accordion, AccordionDetails, AccordionSummary, Autocomplete, CircularProgress, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import strings from "localization/strings";
import AppLayout from "components/layouts/app-layout";
import { SearchMode } from "types";
import { Course, CourseAlias } from "generated/client";
import CourseCard from "components/generic/course-card";
import { ErrorContext } from "components/contexts/error-handler";
import { useApiClient, useDebouncedCall } from "app/hooks";
import Api from "api";
import { Warning, Edit, ExpandMore, Search } from "@mui/icons-material";
import { EmptyBox, PaperCard } from "styled/screens/main-screen";
import theme from "theme";

/**
 * Main screen component
 */
const MainScreen: React.FC = () => {
  const [searchMode, setSearchMode] = useState<SearchMode>(SearchMode.TEXT);
  const [courseAliases, setCourseAliases] = useState<CourseAlias[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesCode, setCourseCode] = useState("");
  const [queryText, setQueryText] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const errorContext = useContext(ErrorContext);
  const { matchApi, courseApi } = useApiClient(Api.getApiClient);

  const coursesPerPage = 5;
  const courseListRef = useRef<HTMLDivElement>(null);
  const queryExamples = [
    "Explain quantum computing in simple terms",
    "I want to learn how to program a robot",
    "Introduction to the stock market and trading"
  ];

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
   * On course code change handler 
   */
  const toggleSearchMode = () => {
    if (searchMode === SearchMode.TEXT) {
      setSearchMode(SearchMode.CODE);
      setQueryText("");
    } else {
      setSearchMode(SearchMode.TEXT);
      setCourseCode("");
    }
    setCourses([]);
  };

  /**
   * Handles page change
   */
  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    // Wait for a short delay before scrolling to the first course card on the new page
    setTimeout(() => {
      if (courseListRef.current !== null) {
        courseListRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
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
        value="left"
        selected={searchMode === SearchMode.TEXT}
        onClick={toggleSearchMode}
        sx={{ borderRadius: theme.spacing(2) }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Edit/>
          <Typography>{ strings.mainScreen.searchMode.text }</Typography>
        </Stack>
      </ToggleButton>
      <ToggleButton
        color="primary"
        value="right"
        selected={searchMode === SearchMode.CODE}
        onClick={toggleSearchMode}
        sx={{ borderRadius: theme.spacing(2) }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Search/>
          <Typography>{ strings.mainScreen.searchMode.code }</Typography>
        </Stack>
      </ToggleButton>
    </ToggleButtonGroup>
  );

  /**
   * Renders code search
   */
  const renderCodeSearch = () => {
    const courseOptions = courseAliases.map(alias => ({ label: alias.code, name: `${alias.code} ${alias.name}` }));

    // cut name after the first , or (, then add ... if name is too long
    courseOptions.forEach(option => {
      let commaIndex = option.name.indexOf(",");
      commaIndex === -1 && (commaIndex = option.name.length);
      let bracketIndex = option.name.indexOf("(");
      bracketIndex === -1 && (bracketIndex = option.name.length);
      const cutIndex = Math.min(commaIndex, bracketIndex);
      option.name = option.name.substring(0, cutIndex);
      if (option.name.length > 49) {
        option.name = `${option.name.substring(0, 49)}...`;
      }
    });

    return (
      <Stack
        direction="column"
        alignItems="center"
        width="100%"
        spacing={4}
        padding={2}
      >
        <Typography>{strings.mainScreen.courseCodeDescription}</Typography>
        <Autocomplete
          fullWidth
          disablePortal
          options={courseOptions}
          inputValue={coursesCode}
          /* eslint-disable @typescript-eslint/no-unused-vars */
          renderOption={(props, option, _) => (<Typography noWrap {...props}>{option.name}</Typography>)}
          onInputChange={(_, newInputValue) => setCourseCode(newInputValue) }
          onChange={(_, newValue) => newValue && onCourseCodeMatch(newValue.label) }
          renderInput={params =>
            <TextField
              {...params}
              variant="outlined"
              name="courseCode"
              label={strings.mainScreen.courseCodePlaceholder}
            />}
        />
      </Stack>
    );
  };

  /**
   * Render limitations
   */
  const renderLimitations = () => (
    <Accordion sx={{ width: "100%" }}>
      <AccordionSummary expandIcon={<Warning/>} aria-controls="limitations-content" id="limitations-header">
        <Typography variant="h4">{strings.mainScreen.limitationsTitle}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" spacing={1}>
          {strings.mainScreen.limitations.map((limitation: string) => (
            <Button
              key={limitation}
              variant="outlined"
              disabled
              sx={{
                textTransform: "none"
              }}
            >
              {limitation}
            </Button>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
  
  /**
   * Renders examples
   */
  const renderExamples = () => (
    <Stack direction="column" alignItems="center" spacing={2}>
      <Typography variant="h4">{strings.mainScreen.examplesTitle}</Typography>
      <Stack
        direction="row"
        spacing={2}
        alignItems="stretch"
      >
        {queryExamples.map((example: string) => (
          <Button
            key={example}
            variant="text"
            onClick={() => onQueryTextChange(example)}
            sx={{
              borderRadius: theme.spacing(1),
              bgcolor: "grey.100",
              textTransform: "none",
              flex: 1
            }}
          >
            {example}
          </Button>
        ))}
      </Stack>
    </Stack>
  );

  /**
   * Renders text search
   */
  const renderTextSearch = () => (
    <Stack
      direction="column"
      alignItems="center"
      width="100%"
      spacing={4}
      padding={2}
    >
      {renderLimitations()}
      {renderExamples()}
      <TextField
        fullWidth
        multiline
        rows={6}
        value={queryText}
        variant="outlined"
        label={strings.mainScreen.courseQueryTextPlaceholder}
        onChange={({ target }) => onQueryTextChange(target.value)}
      />
    </Stack>
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
    <PaperCard elevation={6} sx={{ width: 700 }}>
      <Stack
        direction="column"
        alignItems="center"
        width="100%"
        spacing={2}
        padding={2}
      >
        {renderSearchMode()}
        {searchMode === SearchMode.CODE ? renderCodeSearch() : renderTextSearch()}
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
  const renderCourses = () => {
    const startIndex = (page - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const displayedCourses = courses.slice(startIndex, endIndex);
  
    return (
      <Stack spacing={3}>
        <div ref={courseListRef}/>
        {displayedCourses.map(course => (
          <CourseCard key={course.code} course={course}/>
        ))}
        <Stack
          direction="row"
          display="flex"
          justifyContent="center"
        >
          { courses.length > coursesPerPage &&
            <Pagination
              count={Math.ceil(courses.length / coursesPerPage)}
              page={page}
              onChange={handlePageChange}
            />
          }
        </Stack>
      </Stack>
    );
  };

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
        paddingBottom={4}
        sx={{ overflow: "auto", flex: 1 }}
      >
        {renderSearch()}
        {renderSearchResults()}
      </Stack>
    </AppLayout>
  );
};

export default MainScreen;