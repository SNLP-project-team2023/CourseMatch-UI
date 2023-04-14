import React, { useContext, useEffect, useState } from "react";
import { IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Accordion, AccordionDetails, AccordionSummary, Autocomplete, CircularProgress, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import strings from "localization/strings";
import AppLayout from "components/layouts/app-layout";
import { SearchMode } from "types";
import { Course, CourseAlias } from "generated/client";
import CourseCard from "components/generic/course-card";
import { ErrorContext } from "components/contexts/error-handler";
import { useApiClient, useDebouncedCall } from "app/hooks";
import Api from "api";
import { ArrowLeft, ArrowRight, Brightness5, Warning, Edit, ExpandMore, Search } from "@mui/icons-material";
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
  const [startIndex, setStartIndex] = useState(0);

  const errorContext = useContext(ErrorContext);
  const { matchApi, courseApi } = useApiClient(Api.getApiClient);

  const coursesToView = 5;

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
   * 
  */
  const toggleSearchMode = () => {
    if (searchMode === SearchMode.TEXT) {
      setSearchMode(SearchMode.CODE);
      setQueryText("");
    } else {
      setSearchMode(SearchMode.TEXT);
      setCourseCode("");
    }
    setStartIndex(0);
    setCourses([]);
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
        sx={{ padding: 2 }}
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
   * Renders text search
   */
  const renderTextSearch = () => (
    <Stack
      direction="column"
      alignItems="center"
      width="100%"
      spacing={4}
      sx={{ padding: 2 }}
    >
      <TableContainer sx={{ border: "none" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>
                <Brightness5/>
                <Typography variant="h4" gutterBottom>{strings.mainScreen.examplesTitle}</Typography>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <Warning/>
                <Typography variant="h4" gutterBottom>{strings.mainScreen.limitationsTitle}</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }}>
                {strings.mainScreen.examples.map((example: string) => (
                  <Button
                    variant="outlined"
                    sx={{ minWidth: "200px", m: 1 }}
                    onClick={() => onQueryTextChange(example)}
                  >
                    {example}
                  </Button>
                ))}
              </TableCell>
              <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }}>
                {strings.mainScreen.limitations.map((limitation: string) => (
                  <Button
                    variant="outlined"
                    disabled
                    sx={{ minWidth: "200px", m: 1 }}
                  >
                    {limitation}
                  </Button>
                ))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
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
  const renderCourses = () => (
    <Stack spacing={3}>
      {courses.slice(startIndex, startIndex + coursesToView).map(course => <CourseCard course={course}/>)}
      <Stack direction="row" justifyContent="center" alignItems="center">
        <IconButton onClick={() => setStartIndex(startIndex - coursesToView)} disabled={startIndex < coursesToView}>
          <ArrowLeft/>
        </IconButton>
        <IconButton onClick={() => setStartIndex(startIndex + coursesToView)} disabled={startIndex + coursesToView >= courses.length}>
          <ArrowRight/>
        </IconButton>
      </Stack>
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