import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { Avatar, Typography, Modal, Button, Input, InputLabel } from '@material-ui/core';
import KenButton from '../../../global_components/KenButton';
import KenInputField from '../../../global_components/KenInputField';
import Toaster from './snackbar';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    fonts: {
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '16px',
        lineHeight: '18px',
    },
    heading: {
        padding: "20px 0px 30px 0px!important",
        fontSize: "16px"
    },
    dialoguetitle: {
        textAlign: "center",
        fontSize: "20px",
        padding: "30px 30px 10px 30px"
    },
    acceptbutton: {
        padding: "30px 20px 30px 30px"
    },
    rejecttitle: {
        textAlign: "left !important",
        marginBottom: "20px",
        fontSize: "20px",
        color: "#193389",
        fontWeight: "600"
    },
    rejectdialogue: {
        padding: "0px 15px 30px 30px"
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        zIndex: "9999",
        overflow: "auto",
        outline: "none",
    },
    des: {
        width: "100%"
    },
    uploadFiles: {
        background: "#EBEFFF",
        color: "#092682",
        fontSize: "12px",
        marginLeft: "70px",
    }
}));

const FacultyOnboard = () => {
    const classes = useStyles();
    const [showDialog, setShowDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogButtons, setDialogButtons] = useState([]);
    const [statusaccept, setStatusaccept] = useState(true);
    const [statusreject, setStatusreject] = useState(true);
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [statusDet, setStatusDet] = useState();
    // fileupload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        console.log(file);
    };
    const handleSnackBar = () => {
        setSnackbar(!snackbar)
    }

    const handleSubmit = () => {
        setStatusaccept(false);
        handleDialogClose();
    };

    const handleAcceptClick = () => {
        setDialogTitle("Are you sure you want to Accept?");
        setDialogButtons([
            <Grid container className={classes.acceptbutton}>
                <Grid item md={5} xs={0} />
                <Grid item md={3} xs={6}>
                    <KenButton onClick={handleDialogClose} color="primary">
                        Clear
                    </KenButton>
                </Grid>
                <Grid item md={4} xs={6}>
                    <KenButton
                        onClick={() => {
                            setSnackbarMessage("Thank you for Accepting the Contract.")
                            handleSnackBar()
                            setStatusaccept(false)
                            handleDialogClose();
                            setStatusDet("Accepted")
                        }}
                        variant="primary"
                    >
                        Confirm
                    </KenButton>
                </Grid>
            </Grid>
        ]);
        setShowDialog(true);
    };
    console.log(statusDet);
    const handleRejectClick = () => {
        setDialogTitle(<>
            <Typography className={classes.rejecttitle}>
                Rejected
            </Typography>
            <TextareaAutosize
                aria-label="minimum height"
                minRows={2}
                label={'Reason'}
                placeholder="Enter Description"
                className={classes.des}
            />
        </>
        );
        setDialogButtons([
            <Grid container className={classes.rejectdialogue}>
                <Grid item md={6} xs={0} />
                <Grid item md={3} xs={6}>
                    <KenButton onClick={handleDialogClose} color="primary">
                        Cancel
                    </KenButton>
                </Grid>
                <Grid item md={3} xs={6}>
                    <KenButton
                        onClick={() => {
                            setStatusaccept(false)
                            handleDialogClose();
                            setStatusDet("Rejected")
                        }}
                        variant="primary"
                    >
                        Submit
                    </KenButton>
                </Grid>
            </Grid>
        ]);
        setShowDialog(true);
    };

    const handleDialogClose = () => {
        setShowDialog(false);
    };

    return (
        <Paper style={{ padding: "20px 30px" }}>
            {/* modalbox */}
            <Toaster severity={"sucess"} display={snackbar} message={snackbarMessage} close={handleSnackBar} />
            <div className={classes.root}>
                <Typography className={`${classes.fonts} ${classes.heading}`}>
                    Verify Contract
                </Typography>

                <Grid container>
                    {
                        statusDet === undefined ? null :
                            statusDet === "Accepted" ?
                                <Grid container style={{ marginBottom: "30px" }}>
                                    <Grid item md={1}>
                                        <Typography style={{ paddingTop: "5px" }}>Status :</Typography>
                                    </Grid>
                                    <Grid md={2}>
                                        <Button variant="contained" disabled style={{
                                            background: " #52C15A45", color: "#000000"
                                        }}>
                                            Accepted
                                        </Button>
                                    </Grid>
                                </Grid> :
                                <>
                                    <Grid container style={{ marginBottom: "30px" }}>
                                        <Grid item md={1}>
                                            <Typography style={{ paddingTop: "5px" }}>Status :</Typography>
                                        </Grid>
                                        <Grid md={2}>
                                            <Button variant="contained" disabled style={{
                                                background: "#DD4B3945", color: "#000000"
                                            }}>
                                                Rejected
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: "30px" }}>
                                        <Grid item md={3}>
                                            <Typography>Reason For Rejection</Typography>
                                        </Grid>
                                        <Grid md={9}>
                                            <Typography>Lorem ipsum dolor sit amet consectetur. Cras nequevitae at duis ornare mattis fames. Lorem ipsum dolor sit amet consectetur. Cras nequevitae at duis ornare mattis fames.</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: "30px" }}>
                                        <Grid item md={3}>
                                            <Typography style={{ paddingTop: "5px" }}>Upload Revised Contract</Typography>
                                        </Grid>
                                        <Grid md={3} style={{
                                            borderRadius: "8px", border: "1px solid #E4E4E4"
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', padding: "10px 0px" }}>
                                                <InputLabel htmlFor="file-upload" style={{ marginRight: '16px', fontSize: "12px", padding: "0px 0px 0px 10px" }}>
                                                    Upload file
                                                </InputLabel>
                                                <Input
                                                    id="file-upload"
                                                    type="file"
                                                    onChange={handleFileUpload}
                                                    style={{ display: 'none' }}
                                                />
                                                <label htmlFor="file-upload">
                                                    <Button variant="contained" component="span" className={classes.uploadFiles}>
                                                        <span style={{ fontWeight: "bold" }}>Choose file</span>
                                                    </Button>
                                                </label>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <KenButton
                                        variant="primary"
                                        onClick={() => {
                                            setSnackbarMessage("Your request has been sent for approval.")
                                            handleSnackBar()
                                        }}
                                    >
                                        Send For Approval
                                    </KenButton>
                                </>
                    }
                    {statusDet !== "Rejected" &&
                        <div style={{ width: "100%" }}>
                            <iframe src='https://www.africau.edu/images/default/sample.pdf' style={{ height: "100vh", width: "100%" }} />
                        </div>}

                    {statusaccept ?
                        <Grid container style={{ margin: "20px 0px 20px 0px" }}>
                            <Grid item md={1} xs={6}>
                                <KenButton
                                    label="Accept"
                                    variant="primary"
                                    style={{
                                        borderRadius: "4px",
                                    }}
                                    onClick={() => {
                                        setStatusreject(true);
                                        handleAcceptClick()
                                    }}
                                />
                            </Grid>
                            <Grid item md={1} xs={6}>
                                <KenButton
                                    label="Reject"
                                    color="primary"
                                    style={{
                                        borderRadius: "4px",
                                    }}
                                    onClick={() => {
                                        setStatusreject(false)
                                        handleRejectClick()
                                    }}
                                />
                            </Grid>
                        </Grid> : null}
                    <Dialog open={showDialog} onClose={handleDialogClose} maxWidth="xs" fullWidth={true}>
                        <DialogTitle className={classes.dialoguetitle}>{dialogTitle}</DialogTitle>
                        <DialogActions>
                            {dialogButtons}
                        </DialogActions>
                    </Dialog>
                </Grid>
            </div>
        </Paper >
    );
};

export default FacultyOnboard;
