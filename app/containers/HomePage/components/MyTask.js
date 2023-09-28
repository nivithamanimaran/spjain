import { Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import Assignment from '../../../components/CardWidgets/Assignments';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  title: { fontSize: 16, fontWeight: 600 },
  container: { padding: 0 },
}));

export default function MyTask(props) {
  const { details, flag } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  return (
    <div className={styles.container}>
     
      <Assignment details={details} loading={flag} />
    </div>
  );
}
