import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
    root: {
        boxShadow: `0px 0px 9px ${theme.palette.KenColors.shadowColor}`,
        borderRadius: 3,
        padding: 40,
        marginTop: 10,
        width: '100%'
    },
    examTitle: {
        textAlign: "start",
        marginBottom: 20,
        fontSize: 14,
        color: "#193890fa",
        fontWeight: "bold"
    }
}));

export default function KenCard(props) {
    const { title } = props;

    const classes = useStyles();

    return (
        <React.Fragment>
            {/* <Typography className={classes.mainTitle}></Typography> */}
            <Paper elevation={0} className={classes.root} data-testid="KenCard">
                {title && <Typography className={classes.examTitle}>
                    {title}
                </Typography>}

                {props.children}
            </Paper>
        </React.Fragment>

    );
}
