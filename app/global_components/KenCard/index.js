import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Box, useTheme } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: `0px 0px 9px ${theme.palette.KenColors.shadowColor}`,
    borderRadius: 9,
    padding: 16,
    marginTop: 8,
    width: '100%',
    height: '100%',
  },
  examTitle: {
    textAlign: 'start',
    marginBottom: 20,
    fontSize: 14,
    color: '#193890fa',
    fontWeight: 'bold',
  },
  card: {
    padding: 16,
    marginTop: 10,
    width: '100%',
    border: `1px solid ${theme.palette.KenColors.neutral40}`,
    borderLeft: `3px solid ${theme.palette.KenColors.neutral60}`,
    borderRadius: 5,
  },
  cardInterTitle: {
    color: theme.palette.KenColors.primary,
    fontWeight: 600,
    fontSize: 14,
  },
}));

export default function KenCard(props) {
  const {
    title,
    paperStyles = {},
    activeBorderColor,
    activeBorderWidth = 2,
    active,
    variant,
  } = props;

  const classes = useStyles();
  const theme = useTheme();

  const getVariantStyles = () => {
    if (variant === 'plain') {
      return {};
    }
    return {};
  };

  const getCard = variant => {
    switch (variant) {
      case 'plain':
        return (
          <React.Fragment>
            <Paper
              className={`${classes.root} ${active ? classes.card : ''}`}
              style={{
                padding: 0,
                boxShadow: 'none',
                borderLeft: active
                  ? `${activeBorderWidth}px solid ${activeBorderColor ||
                      theme.palette.KenColors.primary}`
                  : '',
                ...paperStyles,
              }}
            >
              {title && (
                <Typography className={classes.examTitle}>{title}</Typography>
              )}

              {props.children}
            </Paper>
          </React.Fragment>
        );

      case 'cardInter':
        return (
          <React.Fragment>
            <div style={{ border: '1px solid #E3EBF6', borderRadius: 4 }}>
              {title && (
                <Box p={2} style={{ background: '#F1F5FA' }}>
                  <Typography className={classes.cardInterTitle}>
                    {title}
                  </Typography>
                </Box>
              )}

              <Box p={2}>{props.children}</Box>
            </div>
          </React.Fragment>
        );

      default:
        return (
          <React.Fragment>
            <Paper
              className={`${classes.root} ${active ? classes.card : ''}`}
              style={{
                borderLeft: active
                  ? `${activeBorderWidth}px solid ${activeBorderColor ||
                      theme.palette.KenColors.primary}`
                  : '',
                ...paperStyles,
              }}
            >
              {title && (
                <Typography className={classes.examTitle}>{title}</Typography>
              )}

              {props.children}
            </Paper>
          </React.Fragment>
        );
    }
  };

  return <>{getCard(variant)}</>;
}
