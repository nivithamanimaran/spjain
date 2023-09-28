import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
const KenCard = React.lazy(() => import('../../../../global_components/KenCard'));

const useStyles = makeStyles(theme => ({}));

export default function InterviewProcess(props) {
  const classes = useStyles();
  return (
    <Box p={2}>
      <Typography style={{ fontSize: 12, marginBottom: 30 }}>
        The interview should last anywhere from 30-40 mins, covering the
        questions and competencies detailed in the score sheet.
      </Typography>
      <Typography style={{ fontSize: 12, marginBottom: 30 }}>
        We have provided guidelines, per section, to help illustrate the
        expectations from you as an Interviewer. The guideline length provides a
        rough approximation of how much detail is needed, and to provide clarity
        on what we would like to see from the candidate.
      </Typography>
      <Typography style={{ fontSize: 12, marginBottom: 30 }}>
        It is also important that you submit this form by the required deadline.
        As a procedure please email the score sheet to the admissions team after
        conducting the interview. These are the details that need to be showing
      </Typography>
      <Box mt={3}>
        <KenCard variant="cardInter" title="Ambiance and Introduction">
          <Typography style={{ fontSize: 12, marginBottom: 30 }}>
            The interview must take place in a closed office and quiet setting
            with backdrop of SP JAIN, (Backdrop will reflect professionalism and
            accountability towards our brand, has to be prearranged for the
            Panel)
          </Typography>
          <Typography style={{ fontSize: 12, marginBottom: 30 }}>
            Addition to the physical ambience, it’s important to create a
            positive and happy environment for the candidate.
          </Typography>
          <Typography style={{ fontSize: 12, marginBottom: 30 }}>
            Break the ice and greet the candidate with a smile, introducing
            yourself and the panel!
          </Typography>
        </KenCard>
      </Box>
      <Box mt={3}>
        <KenCard variant="cardInter" title="Before You Start">
          <Typography style={{ fontSize: 12, marginBottom: 30 }}>
            Please verify the candidate’s photographic identification before you
            start the interview.
          </Typography>
          <Typography style={{ fontSize: 12, marginBottom: 30 }}>
            The interview must be conducted only in English.
          </Typography>
          <Typography style={{ fontSize: 12, marginBottom: 30 }}>
            Please take the time to read the candidate’s application thoroughly.
          </Typography>
          <Typography style={{ fontSize: 12, marginBottom: 30 }}>
            Be a good listener – allow 80% time for the candidate to speak.
          </Typography>
          <Typography style={{ fontSize: 12, marginBottom: 30 }}>
            Take detailed notes
          </Typography>
        </KenCard>
      </Box>
      <Box mt={3}>
        <KenCard variant="cardInter" title="Interview Process">
          <Typography style={{ fontSize: 12, marginBottom: 30 }}>
            The Interview sheet consists of 3 sections:
          </Typography>
          <Typography style={{ fontSize: 12 }}>
            WORK EXPERIENCE & GOALS AHEAD
          </Typography>
          <Typography style={{ fontSize: 12 }}>OBSERVATION</Typography>
          <Typography style={{ fontSize: 12 }}>FINAL LOOK</Typography>
        </KenCard>
      </Box>
    </Box>
  );
}
