import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import KenInputField from '../../global_components/KenInputField'
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { postEventsData } from '../../utils/ApiService';
import { getUserDetails } from '../../utils/helpers/storageHelper';
import KenLoader from '../../components/KenLoader';
import dayjs from 'dayjs';
import moment from 'moment';
import KenSnackBar from '../../components/KenSnackbar';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontWeight: 600,
        fontSize: '20px',
        color: '#000000',
        lineHeight: '150%',
        [theme.breakpoints.down('sm')]: {
            fontSize: '15px'
        },
    },
    headingContent: {
        fontWeight: 500,
        fontSize: '18px',
        paddingTop: '16px',
        opacity: 0.7,
        color: '#000000',
        lineHeight: '150%',
        [theme.breakpoints.down('sm')]: {
            fontSize: '12px'
        },
    },
    UploadBox: {
        marginTop: '16px',
        border: '1px solid #193389',
        borderRadius: '8px',
        width: '100%',
        height: '280px',
        [theme.breakpoints.down('sm')]: {
            height: '155px'
        },
    },
    footerpage: {
        paddingLeft: '24px',
    },
    footerContainer: {
        paddingTop: '32px'
    },
    SubHeading: {
        fontWeight: 500,
        fontSize: '11px',
        marginTop: '16px',
        opacity: 0.5,
        color: '#000000',
        textTransform: 'uppercase',
        lineHeight: '150%'
    },
    SubHeading1: {
        fontWeight: 500,
        fontSize: '11px',
        paddingTop: '46px',
        opacity: 0.5,
        color: '#000000',
        textTransform: 'uppercase',
        lineHeight: '150%',
        [theme.breakpoints.down('sm')]: {
            paddingTop: '16px',
            fontSize: '10px',
        },
    },
    SubHeading2: {
        fontWeight: 500,
        fontSize: '11px',
        paddingTop: '14px',
        opacity: 0.5,
        color: '#000000',
        textTransform: 'uppercase',
        lineHeight: '150%',
        [theme.breakpoints.down('sm')]: {
            paddingTop: '0px',
            fontSize: '10px',
        },
    },
    Subcontent1: {
        fontWeight: 500,
        fontSize: '12px',
        marginTop: '8px',
        opacity: 0.5,
        color: '#000000',
        textTransform: 'capitalize',
        lineHeight: '150%'
    },
    inputField: {
        borderRadius: '3px',
        backgroundColor: 'white',
        border: '1px solid #E4E4E4',
        // height:'32px',
        paddingTop: '6px',
        lineHeight: '150%',
        borderRadius: '8px !imporatnt'
    },
    RightContainer: {
        border: '1px solid #E4E4E4',
        height: '266px',
        paddingTop: '6px',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF'
    },
    FooterButton: {
        float: 'right',
        paddingTop: '32px'
    },
    SubmitButton: {
        borderRadius: '4px',
        fontSize: '16px',
        backgroundColor: '#193389',
        color: 'white',
        textTransform: 'capitalize',
        fontWeight: 500,
        '&:hover': {
            backgroundColor: '#193389',
            color: 'white'
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '10px',
        },
    },
    input: {
        display: 'none',
    },
    footerButtons1: {
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: '#dfdfe3',
        color: 'black',
        textTransform: 'capitalize',
        fontWeight: 500,
        marginTop: '-13%',
        lineHeight: '150%',
        "&:hover": {
            color: 'black',
            backgroundColor: '#dfdfe3'
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px',
            top: '100px',
        },
    },
    footerButtons: {
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: '#dfdfe3',
        color: 'black',
        textTransform: 'capitalize',
        fontWeight: 500,
        top: '210px',
        lineHeight: '150%',
        "&:hover": {
            color: 'black',
            backgroundColor: '#dfdfe3'
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px',
            top: '100px',
        },
    },
    cancelButton: {
        borderRadius: '4px',
        fontSize: '16px',
        backgroundColor: 'white',
        color: '#193389',
        textTransform: 'capitalize',
        marginRight: '20px',
        fontWeight: 500,
        lineHeight: '150%',
        [theme.breakpoints.down('sm')]: {
            fontSize: '10px',
        },
    },
    TextArea: {
        borderRadius: '3px',
        backgroundColor: 'white',
        border: '1px solid #E4E4E4',
        // height:'32px',
        marginTop: '4px',
        paddingTop: '6px',
        width: '100%',
        lineHeight: '150%',
        borderRadius: '8px !imporatnt',
        minHeight: '282px !important',
        [theme.breakpoints.down('sm')]: {
            minHeight: '155px !important'
        }
    }

}));

function HostEvent() {
    const classes = useStyles();
    const theme = useTheme();
    const [image, setImage] = useState();
    const [eventTitle, setEventTitle] = useState("");
    const [location, setLocation] = useState("");
    const [eventTopic, setEventTopic] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [renderedImage, setRenderedImage] = useState("");
    const userDetails = getUserDetails();
    const[loading,setLoading] = useState(false);
    const now = moment(new Date()).format('YYYY-MM-DD');
    const nowTime = moment().format()
    
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);


    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
      };

    const submitForm = () => {
        setLoading(true)
        const imageSorce = renderedImage.split(',');
        const eventTime = nowTime.slice(10)
        
        const payload = [{
            name: eventTitle,
            description: eventDescription,
            Location: location,
            eventDate: now,
            Topic: eventTopic,
            eventTime: eventTime,
            attachment: [
                     {
                        attachmentName : image.name,
                        attachmentContentType : image.type,
                        attachmentBody : imageSorce[1]
                     }
                    ]
        }]
        // console.log("iamgee",image)
        console.log("payload",payload);
        postEventsData(payload, userDetails.ContactId)
            .then(res => {
                setOpenSnackbar(true)
                setSnackbarMessage('Thank you for Registering');
                setLoading(false);
                console.log(res);
            })
            .catch(err => {
                setOpenSnackbar(true);
                setSnackbarMessage('Something Wrong');
                setSnackbarSeverity('error');
                console.log(err);
                setLoading(false);
            })
    }

    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 50,
        },
        preview: {
            marginTop: 50,
            display: "flex",
            flexDirection: "column",
        },
        image: { width: "100%", maxHeight: 280, borderRadius: '8px' },
        delete: {
            cursor: "pointer",
            padding: 15,
            background: "red",
            color: "white",
            border: "none",
        },
    };

    return (
        <React.Fragment>
            {loading&&<KenLoader/>}
            
            <Typography className={classes.heading}>
                Host an Event
            </Typography >
            <Typography className={classes.headingContent}>
                Interested in hosting a session? Send us a event request by filling the details below.
            </Typography>
            <Box className={classes.UploadBox}>
                {image && (
                    <div style={styles.UploadBox}>
                        <img
                            src={URL.createObjectURL(image)}
                            style={styles.image}
                            alt="Thumb"
                        />
                    </div>
                )}
                <div className={classes.footerpage}>
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={(e) => {
                            let read = new FileReader();
                            read.readAsDataURL(e.target.files[0])
                            read.addEventListener("load", () => {
                                setRenderedImage(read.result)
                            })
                            setImage(e.target.files[0])
                        }}
                    />
                    <label htmlFor="contained-button-file">
                        {image ? <Button className={classes.footerButtons1} component="span">
                            Upload Event Cover
                        </Button> : <Button className={classes.footerButtons} component="span">
                            Upload Event Cover
                        </Button>}
                    </label>
                </div>
            </Box>
            <Grid container spacing={6} className={classes.footerContainer}>
                <Grid item md={5} xs={12}>
                    <Typography className={classes.SubHeading}>
                        Event title
                    </Typography>
                    <KenInputField className={classes.inputField} placeholder={"Enter event title"} onChange={(e) => { setEventTitle(e.target.value) }} />
                    <Typography className={classes.SubHeading1}>
                        Event location
                    </Typography>
                    <KenInputField className={classes.inputField} placeholder={"Enter event location"} onChange={(e) => { setLocation(e.target.value) }} />
                    <Typography className={classes.Subcontent1}>
                        If it’s virtual, choose the virtual option
                    </Typography>
                    <Typography className={classes.SubHeading1}>
                        Event topic
                    </Typography>
                    <KenInputField className={classes.inputField} placeholder={"Enter event topic"} onChange={(e) => { setEventTopic(e.target.value) }} />
                </Grid>
                <Grid item md={7} xs={12} >
                    <Typography className={classes.SubHeading2}>
                        Event Description
                    </Typography>
                    <TextareaAutosize className={classes.TextArea}
                        placeholder={"Enter event description"}
                        onChange={(e) => {
                            setEventDescription(e.target.value);
                            console.log("event-->", e.target.value);
                        }} />
                </Grid>
            </Grid>
            <Box className={classes.FooterButton}>
                <Button className={classes.cancelButton}>Cancel</Button>
                <Button className={classes.SubmitButton} onClick={() => submitForm()}>Submit Request</Button>
            </Box>
            <KenSnackBar
                severity={snackbarSeverity}
                message={snackbarMessage}
                autoHideDuration={5000}
                open={openSnackbar}
                handleSnackbarClose={handleSnackbarClose}
                position="Top-Center"
            />
        </React.Fragment>
    )
}

export default HostEvent;