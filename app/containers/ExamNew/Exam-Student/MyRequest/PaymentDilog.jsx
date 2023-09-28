import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import KenSelect from '../../../../global_components/KenSelect';

const useStyles = makeStyles(theme => ({
  dialogContent: {
    padding: theme.spacing(2),
  },
  paymentSummary: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '20px',
    marginTop: '20px',
  },
  borderBottom: {
    borderBottom: '1px solid #D2E1E957',
    paddingLeft: theme.spacing(1),
  },
  totalAmount: {
    fontSize: '18px',
    fontWeight: 600,
  },
  payNowButton: {
    color: '#193389',
    marginRight: theme.spacing(2),
  },
  payLaterButton: {
    background: '#193389',
    color: 'white',
    borderRadius: '8px',
    '&:hover': {
      background: '#193389',
      color: 'white',
      borderRadius: '8px',
    },
  },
}));

const PaymentDialog = ({
  open,
  handleClose,
  selectedOption,
  setSelectedOption,
  course,
  setCourse,
  exam,
  setExam,
  handlePayment,
}) => {
  const handleOptionChange = event => {
    setSelectedOption(event.target.value);
  };
  const classes = useStyles();
  const handleCourseChange = event => {
    setCourse(event.target.value);
  };

  const handleExamChange = event => {
    setExam(event.target.value);
  };

  const handlePayNow = () => {
    handlePayment(selectedOption, course, exam);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Request Application</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup value={selectedOption} onChange={handleOptionChange} row>
            <FormControlLabel
              value="AnswerSheet"
              control={<Radio />}
              label="Answer Sheet"
            />
            <FormControlLabel
              value="Reevaluation"
              control={<Radio />}
              label="Re-Evaluation"
            />
            <FormControlLabel
              value="ReExam"
              control={<Radio />}
              label="Re-Exam"
            />
          </RadioGroup>
        </FormControl>

        {selectedOption === 'AnswerSheet' && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <KenSelect
                value={course}
                optionalLabel={false}
                onChange={handleCourseChange}
                label="Course"
                options={[
                  { label: 'Digital Literacy', value: 'Digital Literacy' },
                  { label: 'Tech Literacy', value: 'Tech Literacy' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <KenSelect
                value={exam}
                onChange={handleExamChange}
                label="Exam"
                optionalLabel={false}
                options={[
                  { label: 'End Term', value: 'End Term' },
                  { label: 'Mid Term', value: 'Mid Term' },
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <div className={classes.paymentSummary}>Payment Summary:</div>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{ marginBottom: '20px', paddingLeft: '10px' }}
            >
              <Grid item xs={12} md={9}>
                <div
                  style={{
                    color: '#7A7A7B',
                    fontSize: '18px',
                    fontWeight: 400,
                  }}
                >
                  Per Answer Sheet
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div
                  style={{
                    color: '#7A7A7B',
                    fontSize: '18px',
                    fontWeight: 400,
                  }}
                >
                  200
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2} className={classes.borderBottom}>
              <Grid item xs={12} md={9}>
                <div
                  style={{
                    color: '#7A7A7B',
                    fontSize: '18px',
                    fontWeight: 400,
                  }}
                >
                  Per Exam:
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div
                  style={{
                    color: '#7A7A7B',
                    fontSize: '18px',
                    fontWeight: 400,
                  }}
                >
                  200
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{ paddingTop: '20px', paddingLeft: '10px' }}
            >
              <Grid item xs={12} md={9}>
                <div className={classes.totalAmount}>Total Amount</div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className={classes.totalAmount}>400</div>
              </Grid>
            </Grid>
          </Grid>
        )}

        {selectedOption === 'Reevaluation' && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <KenSelect
                value={course}
                optionalLabel={false}
                onChange={handleCourseChange}
                label="Course"
                options={[
                  { label: 'Digital Literacy', value: 'Digital Literacy' },
                  { label: 'Tech Literacy', value: 'Tech Literacy' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <KenSelect
                value={exam}
                onChange={handleExamChange}
                optionalLabel={false}
                label="Exam"
                options={[
                  { label: 'End Term', value: 'End Term' },
                  { label: 'Mid Term', value: 'Mid Term' },
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <div className={classes.paymentSummary}>Payment Summary:</div>
            </Grid>
            <Grid container spacing={2} className={classes.borderBottom}>
              <Grid item xs={12} md={9}>
                <div
                  style={{
                    color: '#7A7A7B',
                    fontSize: '18px',
                    fontWeight: 400,
                  }}
                >
                  Per Exam:
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div
                  style={{
                    color: '#7A7A7B',
                    fontSize: '18px',
                    fontWeight: 400,
                  }}
                >
                  200
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{ paddingTop: '20px', paddingLeft: '10px' }}
            >
              <Grid item xs={12} md={9}>
                <div className={classes.totalAmount}>Total Amount</div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className={classes.totalAmount}>200</div>
              </Grid>
            </Grid>
          </Grid>
        )}

        {selectedOption === 'ReExam' && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <KenSelect
                value={course}
                onChange={handleCourseChange}
                optionalLabel={false}
                label="Course"
                options={[
                  { label: 'Digital Literacy', value: 'Digital Literacy' },
                  { label: 'Tech Literacy', value: 'Tech Literacy' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <KenSelect
                value={exam}
                optionalLabel={false}
                onChange={handleExamChange}
                label="Exam"
                options={[
                  { label: 'End Term', value: 'End Term' },
                  { label: 'Mid Term', value: 'Mid Term' },
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <div className={classes.paymentSummary}>Payment Summary:</div>
            </Grid>
            <Grid container spacing={2} className={classes.borderBottom}>
              <Grid item xs={12} md={9}>
                <div
                  style={{
                    color: '#7A7A7B',
                    fontSize: '18px',
                    fontWeight: 400,
                  }}
                >
                  Per Exam:
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div
                  style={{
                    color: '#7A7A7B',
                    fontSize: '18px',
                    fontWeight: 400,
                  }}
                >
                  200
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{ paddingTop: '20px', paddingLeft: '10px' }}
            >
              <Grid item xs={12} md={9}>
                <div className={classes.totalAmount}>Total Amount</div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className={classes.totalAmount}>200</div>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Box
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            float: 'right',
          }}
        >
          <Button onClick={handlePayNow} className={classes.payLaterButton}>
            Pay Now
          </Button>
          <Button className={classes.payNowButton} onClick={handleClose}>
            Pay Later
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
