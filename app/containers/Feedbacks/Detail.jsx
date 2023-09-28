import React, { useEffect, useState } from 'react';
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
import {
    getStudentFeedbackDetails,
    postStudentFeedbackDetails,
} from './../../utils/ApiService';
import { getUserDetails } from '../../utils/helpers/storageHelper';
import KenLoader from '../../components/KenLoader';
import KenSnackBar from '../../components/KenSnackbar';

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },

    pos: {
        marginBottom: 12,
        lineHeight: '18.77px',
    },
    sub: {
        marginLeft: '200px',
        marginTop: '-22px',
        fontSize: '16px',
        fontWeight: '600px',
        color: '#090F69',
        fontStyle: 'normal',
    },
    Slider: {
        width: '700px',
        marginLeft: '30px',
    },
    parameter: {
        marginTop: '10px',
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
        fontFamily: "Work Sans",
        fontWeight: "400",
        fontSize: "12px",
        color: "#090F69",
        lineHeight: "100%",
        marginLeft: '15px'
    },
    three: {
        marginLeft: "648px",
        fontFamily: "Work Sans",
        fontWeight: "400",
        fontSize: "12px",
        color: "#090F69",
        lineHeight: "100%",
        // position: 'absolute',
        // right: theme.spacing(2),
    },
    four: {
        marginLeft: '32px',
        fontFamily: 'Work Sans',
        fontWeight: 'bold',
        fontSize: '11px',
        lineHeight: '100%',
        opacity: '50%',
    },
    five: {
        fontFamily: 'Work Sans',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '16px',
        lineHeight: '19px',
    },
    six: {
        fontFamily: 'Work Sans',
        fontWeight: '600',
        fontSize: '16px',
        lineHeight: '19px',
        color: '#090F69',
        // marginLeft: "-25px"
    },
    seven: {
        fontFamily: 'Work Sans',
        fontWeight: '600',
        fontSize: '16px',
        lineHeight: '19px',
        color: '#090F69',
        marginLeft: '83px',
    },
    eight: {
        fontFamily: 'Work Sans',
        fontWeight: '600',
        fontSize: '16px',
        lineHeight: '19px',
        color: '#090F69',
    },
    nine: {
        fontFamily: 'Work Sans',
        fontWeight: '600',
        fontSize: '16px',
        lineHeight: '19px',
        color: '#090F69',
    },
    ten: {
        fontFamily: 'Work Sans',
        fontWeight: '600',
        fontSize: '16px',
        lineHeight: '19px',
        color: '#090F69',
        // marginLeft: "17px"
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
    const classes = useStyles();
    const theme = useTheme();
    const { facultyDetail } = props;
    const userDetails = getUserDetails();
    const [comments, setComments] = useState('');
    const [slideValue, setSliderValue] = useState('');
    const [rate, setRate] = useState('');
    const [loading, setLoading] = useState(false);
    //Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    let parameters = facultyDetail.feedbackParameter.split(';');

    console.log('parameters', parameters);
    React.useEffect(() => {
        setLoading(true);
        getStudentFeedbackDetails(userDetails.ContactId)
            .then(res => {
                setInstituteFeedbackDetails(res);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);
    console.log('text', getStudentFeedbackDetails);

    const postFeedback = () => {
        let payload = [
            {
                courseConnectionId: facultyDetail?.courseConnectionId,
                facultyId: facultyDetail?.facultyId,
                parameter: facultyDetail?.feedbackParameter,
                rating: rate,
                recordType: facultyDetail?.recordType,
            },
        ];

        postStudentFeedbackDetails(payload)
            .then(res => {
                console.log(res);
                handleSnackbarOpen('success', 'Successfully Submitted');
                window.location.href = '/Feedbacks';
            })
            .catch(err => {
                handleSnackbarOpen('error', 'Enter valid details');
                return err;
            });
    };

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

    return (
        <div>
            {loading && <KenLoader />}
            <KenSnackBar
                message={snackbarMessage}
                severity={snackbarSeverity}
                autoHideDuration={5000}
                open={openSnackbar}
                handleSnackbarClose={handleSnackbarClose}
                position="Top-Center"
            />
            {facultyDetail ? (
                <>
                    <Card className={classes.root}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Grid container spacing={1}>
                                        <Grid item sm={12} md={12}>
                                            <Grid container>
                                                <Grid item xs={3} md={3}>
                                                    <span className={classes.five}>
                                                        Name of the Faculty :
                                                    </span>
                                                </Grid>
                                                <Grid item xs={3} md={3}>
                                                    <span className={classes.six}>
                                                        {facultyDetail.facultyName}
                                                    </span>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item sm={12} md={12}>
                                            <Grid container>
                                                <Grid item xs={3} md={3}>
                                                    <span className={classes.five}>Subject Code :</span>
                                                </Grid>
                                                <Grid item xs={3} md={3}>
                                                    <span className={classes.six}>
                                                        {facultyDetail.subjectCode}
                                                    </span>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item sm={12} md={12}>
                                            <Grid container>
                                                <Grid item xs={3} md={3}>
                                                    <span className={classes.five}>Subject Name :</span>
                                                </Grid>
                                                <Grid item xs={3} md={6}>
                                                    <span className={classes.six}>
                                                        {facultyDetail.subjectName}
                                                    </span>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* <Grid item>
                                        <Grid container spacing={1}>
                                            <Grid item sm={12} md={12}>
                                                <Grid container>
                                                    <Grid item xs={6}><span className={classes.five}>Subject Name :</span></Grid>
                                                    <Grid item xs={6}><span className={classes.six}>{facultyDetail.subjectName}</span></Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid> */}
                            </Grid>
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
                                {parameters.map(parameter => (
                                    <CardContent>
                                        
                                            <Typography className={classes.one}>
                                                {parameter}
                                            </Typography>
                                            <CardActions>
                                                < Typography >
                                                    <span className={classes.two}>Poor</span><span className={classes.three}> Excellent</span>
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
                                                    setRate(`${value}`);
                                                }}
                                            />
                                        
                                    </CardContent>
                                ))}
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography className={classes.four}>COMMENT</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={6}
                                        placeholder="Add a brief description"
                                        onChange={e => setComments(e.target.value)}
                                        className={classes.des}
                                    />
                                </Grid>
                            </Grid>
                            <CardActions style={{ float: 'right', marginRight: '4%' }}>
                                <div style={{ display: 'flex' }}>
                                    <Button
                                        variant="contained"
                                        style={{
                                            background: 'white',
                                            marginRight: '13px',
                                            boxShadow: 'none',
                                            color: '#193389',
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            postFeedback();
                                        }}
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
