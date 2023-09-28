import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import Link from '@material-ui/core/Link';
import { Typography } from '@material-ui/core';
import './index.css';

const useStyles = makeStyles(theme => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  link: {
    fontSize: 12,
    color: theme.palette.KenColors.primary,
    textDecoration: 'none',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  link2: {
    textDecoration: 'none',
    fontSize: 12,
  },
  separator: {
    marginLeft: 4,
    marginRight: 4,
  },
  crumbText: {
    fontSize: 12,
    color: theme.palette.KenColors.primary,
    textDecoration: 'none',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default function BreadCrumb(props) {
  const classes = useStyles();
  const array = props.array;

  const handleClick = item => event => {
    event.preventDefault();
    props.history.push(item.url);
  };

  return (
    <div className={classes.root}>
      <Breadcrumbs
        separator={<DoubleArrowIcon style={{fontSize: 12, color: '#00218D'}} />}
        classes={{
          separator: classes.separator,
        }}
        aria-label="breadcrumb"
      >
        {array &&
          array.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              // name={item.url}
              onClick={handleClick(item)}
              className="breadCrumbText"
              // className={classes.link}
              // style={item.color ? { color: `${item.color}` } : {}}
            >
              <Typography style={item?.style} className={classes.crumbText}>
                {item.head}
              </Typography>
            </Link>
          ))}
      </Breadcrumbs>
    </div>
  );
}
