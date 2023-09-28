import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useTheme } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import {
  getProgramFeedbackDetails,
  postProgramFeedbackCollection,
  postProgramFeedbackDetails,
} from '../../utils/ApiService';
import { getUserDetails } from '../../utils/helpers/storageHelper';
import KenSnackBar from '../../components/KenSnackbar';
import { result } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: '16px',
    height: '35px',
    fontWeight: '400px',
    fontFamily: 'Work Sans',
    lineHeight: '19px',
  },
  pos: {
    marginBottom: 12,
    lineHeight: '18.77px',
  },
  sub: {
    marginLeft: '200px',
    marginTop: '-22px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#090F69',
    fontStyle: 'normal',
    fontFamily: 'Work Sans',
  },
  Slider: {
    width: '700px',
    marginLeft: '30px',
  },
  parameter: {
    marginTop: '30px',
  },
  titled: {
    fontFamily: 'Work sans',
    fontWeight: '600',
    fontSize: '18px',
    lineHeight: '21.11px',
    paddingLeft: '35px',
    paddingTop: '23px',
    color: '#092682',
    height: '70px',
  },
  one: {
    fontFamily: 'Work sans',
    fontWeight: 'bold',
    fontSize: '18px',
    lineHeight: '24.8px',
    color: '#090F69',
    marginLeft: '21px',
  },
  two: {
    fontFamily: 'Work Sans',
    fontWeight: '400',
    fontSize: '12px',
    color: '#090F69',
    lineHeight: '100%',
    marginLeft: '15px',
  },
  three: {
    marginLeft: '648px',
    fontFamily: 'Work Sans',
    fontWeight: '400',
    fontSize: '12px',
    color: '#090F69',
    lineHeight: '100%',
  },
  four: {
    marginLeft: '32px',
    fontFamily: 'Work Sans',
    fontWeight: 'bold',
    fontSize: '11px',
    lineHeight: '100%',
    opacity: '50%',
  },
  des: {
    marginLeft: '35px',
    width: '450px',
    height: '108px',
    marginTop: '10px',
    fontSize: '14px',
    resize: 'none',
    height: '108px',
    paddingTop: '12px',
    paddingLeft: '12px',
    borderRadius: '8px',
  },
}));
const marks = [
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 6,
    label: '6',
  },
  {
    value: 7,
    label: '7',
  },
  {
    value: 8,
    label: '8',
  },
  {
    value: 9,
    label: '9',
  },
  {
    value: 10,
    label: '10',
  },
];
function valuetext(value) {
  return `${value}`;
}

export default function Program(props) {
  console.log('qwerggcx', props);
  const { programDetail, setDisableButton } = props;
  let slideValue = [];
  //   const [parmas, setParams] = useState([]);
  const [params, setParams] = useState([]);
  const [sumValue, setSumValue] = useState(0);
  const [value, setValue] = useState([]);
  value[0] = 0;
  const classes = useStyles();
  const userDetails = getUserDetails();
  const [rate, setRate] = useState('');
  //Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // const preState = usePre(value);

  // const usePre = (value) => {
  //     const ref = useRef();
  //     useEffect(() => {
  //         ref.current = value;
  //     });
  //     return ref.current;
  // }

  // useEffect(() => {
  //     let parameters = programDetail?.feedbackParameter;
  //     let parameterArrays = parameters.split(";")
  //     setParams(parameterArrays);
  // }, [])

  useEffect(() => {
    let parameters = programDetail?.feedbackParameter;
    // let parameterArrays = parameters.split(';');
    const data = parameters?.split(';').map(el => {
      return {
        param: el,
        value: null,
      };
    });
    setParams(data);
  }, [programDetail]);

  // useEffect(() => {
  //     if (value !== preState) {
  //         slideValue[index] = value;
  //         let sum = sumValue + slideValue[index];
  //         setSumValue(sum)
  //     }
  // }, [value])
  const changeSliderValue = (event, value, index) => {
    const paramsCopy = [...params];
    paramsCopy[index].value = value;
  };
//   const changeSliderValue = (event, value, index) => {
//     console.log('event, value, index', event, value, index);
//     let values = [];
//     values[index] = value;
//     setValue(values);
//     slideValue[index] = value;
//     let sum = sumValue + slideValue[index];
//     setSumValue(sum);
//   };

  //Snackbar called
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
  };

  console.log('sum', sumValue);
  const [comment, setComments] = useState('');

  // const postFeedback = () => {
  //     let payload = {
  //         requestData:[
  //             {
  //                 parameter: programDetail?.feedbackParameter,
  //                 rating: sumValue,
  //                 programId: programDetail?.programId,
  //                 studentId: userDetails.ContactId,
  //                 descFeedback: programDetail?.descFeedback,
  //             }
  //          ]
  //     }

  //     // postProgramFeedbackDetails(payload)
  //     postProgramFeedbackCollection(payload)
  //         .then((res) => {

  //             console.log("res", res);
  //             handleSnackbarOpen('success', 'Successfully Submitted' );
  //             // window.location.href='/Feedbacks';
  //         }).catch(err => {
  //             handleSnackbarOpen('error', 'Enter valid details' )
  //             return err
  //         })
  // }
  // const postFeedback = () => {
  //     const data = parmas?.map(el => {
  //       return {
  //         parameter: el?.param,
  //         rating: el?.value,
  //         programId: programDetail?.programId,
  //         studentId: userDetails.ContactId,
  //         descFeedback: programDetail?.descFeedback,
  //       };
  //     });
  //     if (comment !== null || comment !== undefined) {
  //       data.push({

  //         programId: programDetail?.programId,
  //         studentId: userDetails.ContactId,
  //         descFeedback: comment,

  //       });
  //     }
  //     postProgramFeedbackCollection({ requestData: [...data] })
  //       .then(res => {
  //         // toast.success('The Feedback has been Submitted', {
  //         //   position: 'bottom-right',
  //         //   autoClose: 4997,
  //         //   hideProgressBar: true,
  //         //   closeOnClick: true,
  //         //   pauseOnHover: true,
  //         //   draggable: true,
  //         //   progress: 0,
  //         //   theme: 'colored',
  //         // });
  //         if(res.status ==='201'){

  //         }

  //         props.setDisableButton(false);
  //       })
  //       .catch(err => {
  //         return err;
  //       });
  //   };

  const postFeedback = () => {
    const data = params?.map(el => {
      return {
        parameter: el?.param,
        rating: el?.value,
        programId: programDetail?.programId,
        studentId: userDetails.ContactId,
        descFeedback: programDetail?.descFeedback,
      };
    });
    if (comment !== null || comment !== undefined) {
      data?.push({
        programId: programDetail?.programId,
        studentId: userDetails.ContactId,
        descFeedback: comment,
      });
    }
    postProgramFeedbackCollection({ requestData: [...data] })
      .then(res => {
        toast.success('The Feedback has been Submitted', {
          position: 'bottom-right',
          autoClose: 4997,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: 'colored',
        });

        setDisableButton(false);
      })
      .catch(err => {
        console.log('err', err);
        return err;
      });
  };

  return (
    <div>
      <KenSnackBar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Top-Center"
      />
      {programDetail ? (
        <>
          <Card className={classes.root}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Name of the Program :{' '}
                <Typography className={classes.sub}>
                  {programDetail?.programName}
                </Typography>
              </Typography>
              <Typography color="textSecondary" className={classes.title}>
                Program Code :{' '}
                <Typography className={classes.sub}>
                  {programDetail?.programId}
                </Typography>
              </Typography>
              <Typography className={classes.title} color="textSecondary">
                Academic Year :{' '}
                <Typography className={classes.sub}>
                  {programDetail?.startDate} / {programDetail?.endDate}
                </Typography>
              </Typography>
            </CardContent>
          </Card>
          <Card className={classes.parameter}>
            <Typography
              className={classes.titled}
              color="textSecondary"
              gutterBottom
              style={{ background: '#F1F5FA' }}
            >
              Parameters
            </Typography>
            {params?.map((item, index) => {
              return (
                <CardContent>
                  <Typography className={classes.one} key={index}>
                    {item?.programName}
                  </Typography>
                  <CardActions>
                    <Typography>
                      <span className={classes.two}>Poor</span>
                      <span className={classes.three}> Excellent</span>
                    </Typography>
                  </CardActions>
                  <Slider
                    className={classes.Slider}
                    min={1}
                    max={10}
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider-custom"
                    step={null}
                    marks={marks}
                    // defaultValue={slideValue}
                    onChange={(event, value) => {
                      console.log(`Value of ${value} clicked`);
                      changeSliderValue(event, Number(value), index);
                      setRate(`${value}`);
                    }}
                  />
                </CardContent>
              );
            })}
            <Grid container>
              <Grid item xs={12}>
                <>
                  <Typography className={classes.four}>COMMENT</Typography>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={6}
                    placeholder="Add a brief description"
                    onChange={e => setComments(e.target.value)}
                    className={classes.des}
                  />
                </>
              </Grid>
            </Grid>
            <CardActions style={{ float: 'right', marginRight: '4%' }}>
              <div style={{ display: 'flex' }}>
                {/* <Button
                  variant="contained"
                  style={{
                    background: 'white',
                    marginRight: '13px',
                    boxShadow: 'none',
                    color: '#193389',
                  }}
                >
                  Cancel
                </Button> */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => postFeedback()}
                >
                  Submit
                </Button>
              </div>
            </CardActions>
          </Card>
        </>
      ) : null}
    </div>
  );
}
