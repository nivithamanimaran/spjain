import {
  Box,
  Paper,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
} from '@material-ui/core';
import React from 'react';
import KenButton from '../../global_components/KenButton';
import CheckIcon from '@material-ui/icons/Check';
const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#F1F5FA',
    fontFamily: "'Work Sans'",
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.1px',
    color: '#092682',
  },
  body: {
    fontFamily: "'Work Sans'",
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.1px',
    color: '#090F69',
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    //   '&:nth-of-type(odd)': {
    //     backgroundColor: theme.palette.action.hover,
    //   },
  },
}))(TableRow);
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  button: {
    borderRadius: '3px',
  },
});
export default function RatingTable(props) {
  const { parameters, handleChange, onSubmit } = props;
  const classes = useStyles();

  const radioData = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
  ];
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Parameters</StyledTableCell>
              <StyledTableCell align="center">Rating</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters.map((item, index) => {
              return (
                <StyledTableRow>
                  <StyledTableCell>{item.FeedbackTitle}</StyledTableCell>
                  <StyledTableCell align="right">
                    <FormControl>
                      <RadioGroup
                        row={true}
                        aria-label={item.FeedbackTitle}
                        name="cots"
                        value={item.rating}
                        onChange={(event)=> handleChange(event, item, index)}
                      >
                        {radioData.map(el => {
                          return (
                            <FormControlLabel
                              style={{ padding: '0px 10px', marginLeft: "10px" }}
                              labelPlacement="start"
                              value={el.value}
                              control={<Radio />}
                              label={el.label}
                            />
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <KenButton
          variant="primary"
          onClick={onSubmit}
          buttonClass={classes.button}
          endIcon={<CheckIcon />}
        >
          Submit
        </KenButton>
      </Box>
    </Box>
  );
}
