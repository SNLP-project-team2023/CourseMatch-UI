import { useState } from "react";
import { Course } from "generated/client";
import { Button, Dialog, DialogActions, DialogContent, Divider, Stack, Typography } from "@mui/material";
import { PaperCard } from "styled/screens/main-screen";
import { DialogHeader } from "styled/generic/generic-dialog";
import strings from "localization/strings";
import * as React from "react";

/**
 * Component properties
 */
interface Props {
  course: Course;
}

/**
 * Generic dialog component
 *
 * @param props component properties
 */
const CourseCard: React.FC<Props> = ({
  course
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * Renders course dialog
   */
  const renderCourseDialog = () => (
    <Dialog
      fullWidth
      open={ dialogOpen }
      onClose={ () => setDialogOpen(false) }
      maxWidth="md"
    >
      <DialogHeader>
        <Stack>
          <Typography variant="h3">{`${course.name} (${course.credits}${strings.course.credits})`}</Typography>
          <Typography variant="body2">{course.code}</Typography>
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
      <PaperCard elevation={6} sx={{ width: 700, cursor: "pointer" }} onClick={() => setDialogOpen(true)}>
        <Stack spacing={2}>
          <Stack>
            <Typography variant="h3">{course.name}</Typography>
            <Typography variant="body2">{course.code}</Typography>
          </Stack>
          <Stack>
            <Typography variant="h5">{course.language}</Typography>
            <Typography variant="h5">{course.period}</Typography>
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