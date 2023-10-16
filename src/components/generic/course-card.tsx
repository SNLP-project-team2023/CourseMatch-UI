import { useState, useContext } from "react";
import { Course } from "generated/client";
import { IconButton, Button, Dialog, DialogActions, DialogContent, Divider, Stack, Typography, Tooltip } from "@mui/material";
import { ThumbUpRounded, ThumbDownRounded } from "@mui/icons-material";
import { PaperCard } from "styled/screens/main-screen";
import { DialogHeader } from "styled/generic/generic-dialog";
import theme from "theme";
import { useApiClient } from "app/hooks";
import Api from "api";
import strings from "localization/strings";
import { ErrorContext } from "components/contexts/error-handler";
import * as React from "react";

/**
 * Component properties
 */
interface Props {
  course: Course;
  queryText: string;
  coursesCode: string;
}

/**
 * Generic dialog component
 *
 * @param props component properties
 */
const CourseCard: React.FC<Props> = ({
  course,
  queryText,
  coursesCode
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hoveredUp, setHoveredUp] = useState(false);
  const [hoveredDown, setHoveredDown] = useState(false);
  const [likePressed, setLikePressed] = useState(false);
  const [dislikePressed, setDislikePressed] = useState(false);

  const errorContext = useContext(ErrorContext);
  const { feedbackApi } = useApiClient(Api.getApiClient);

  /**
   * Handles like
   * 
   * @param desc course description
   */
  const handleLike = async (desc: string) => {
    setLikePressed(true);
    try {
      await feedbackApi.feedbackPost({
        feedback: {
          queryText: queryText,
          matchText: desc !== "" ? desc : "",
          matchCode: coursesCode !== "" ? coursesCode : "",
          label: 1
        }
      });
    } catch (error) {
      setLikePressed(false);
      const errorMessage = `${strings.errorHandling.feedback.send}`;
      errorContext.setError(`${errorMessage}. ${strings.generic.serviceUnavailable}`);
    }
  };

  /**
   * Handles dislike
   * 
   * @param desc course description
   */
  const handleDislike = async (desc: string) => {
    setDislikePressed(true);
    try {
      await feedbackApi.feedbackPost({
        feedback: {
          queryText: queryText,
          matchText: desc !== "" ? desc : "",
          matchCode: coursesCode !== "" ? coursesCode : "",
          label: 0
        }
      });
    } catch (error) {
      setDislikePressed(false);
      const errorMessage = `${strings.errorHandling.feedback.send}`;
      errorContext.setError(`${errorMessage}. ${strings.generic.serviceUnavailable}`);
    }
  };

  /**
   * Renders course dialog
   */
  const renderCourseDialog = () => (
    <Dialog
      fullWidth
      open={ dialogOpen }
      onClose={ () => setDialogOpen(false) }
      maxWidth="md"
      PaperProps={{ style: { maxHeight: "70%" } }}
    >
      <DialogHeader>
        <Stack>
          <Typography variant="h3">{`${course.name} (${course.credits}${strings.course.credits})`}</Typography>
          <Typography variant="body2">{course.code}</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            {!dislikePressed && (
              <Tooltip title={strings.course.positiveFeedback} arrow>
                <IconButton disabled={likePressed} onClick={() => course.desc && handleLike(course.desc)}>
                  <ThumbUpRounded
                    sx={{
                      cursor: "pointer",
                      color: hoveredUp ? theme.palette.success.light : "inherit"
                    }}
                    onMouseEnter={() => setHoveredUp(true)}
                    onMouseLeave={() => setHoveredUp(false)}
                  />
                </IconButton>
              </Tooltip>
            )}
            {!likePressed && (
              <Tooltip title={strings.course.negativeFeedback} arrow>
                <IconButton disabled={dislikePressed} onClick={() => course.desc && handleDislike(course.desc)}>
                  <ThumbDownRounded
                    sx={{
                      cursor: "pointer",
                      color: hoveredDown ? theme.palette.error.light : "inherit"
                    }}
                    onMouseEnter={() => setHoveredDown(true)}
                    onMouseLeave={() => setHoveredDown(false)}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </DialogHeader>
      <DialogContent>
        <Stack spacing={1}>
          <Stack>
            <Typography sx={{ fontWeight: 600 }}>{`${strings.course.period}:`}</Typography>
            <Typography>{course.period}</Typography>
          </Stack>
          <Stack>
            <Typography sx={{ fontWeight: 600 }}>{`${strings.course.language}:`}</Typography>
            <Typography>{course.language}</Typography>
          </Stack>
          <Divider/>
          <Stack>
            <Typography sx={{ fontWeight: 600 }}>{`${strings.course.description}:`}</Typography>
            <Typography>{course.desc}</Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          href={course.mycoursesLink}
          color="info"
        >
          { strings.course.goToMycourses }
        </Button>
        <Button
          color="info"
          href={course.sisuLink}

        >
          { strings.course.goToSisu }
        </Button>
        <Button
          color="primary"
          onClick={ () => setDialogOpen(false) }
        >
          { strings.generic.cancel }
        </Button>
      </DialogActions>
    </Dialog>
  );

  /**
   * Component render
   */
  return (
    <>
      <PaperCard
        elevation={6}
        sx={{
          cursor: "pointer", maxWidth: "100%"
        }}
        onClick={() => setDialogOpen(true)}
      >
        <Stack spacing={2}>
          <Typography variant="h3">{course.name}</Typography>
          <Typography variant="body2">{course.code}</Typography>
          <Stack>
            <Typography variant="h5">{course.language}</Typography>
            <Typography variant="h5" style={{ wordBreak: "break-all" }}>{course.period}</Typography>
          </Stack>
          <Typography
            variant="body2"
            sx={{
              position: "relative",
              textAlign: "right",
              color: "blue",
              textDecoration: "underline"
            }}
          >
            { strings.course.moreInfo }
          </Typography>
        </Stack>
      </PaperCard>
      {renderCourseDialog()}
    </>
  );
};

export default CourseCard;