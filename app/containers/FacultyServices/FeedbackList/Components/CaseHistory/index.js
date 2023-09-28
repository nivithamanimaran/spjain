import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  makeStyles,
  Button,
  Typography,
} from '@material-ui/core';
// import '../../../../containers/App/styles.scss';
import KenGrid from '../../../../../global_components/KenGrid';
import KenButton from '../../../../../global_components/KenButton';
import configContext from '../../../../../utils/helpers/configHelper';
import { useTranslation } from 'react-i18next';
import { BsThreeDots } from 'react-icons/bs';
import Data from './data.json';
import { getCaseHistory } from '../../../../../utils/ApiService';
const useStyles = makeStyles(theme => ({
  actionBtn: {
    borderRadius: '50%',
  },
  subHead: {
    fontFamily: 'Work Sans',
    fontSize: '12px',
    color: '#505F79',
    textTransform: 'capitalize',
    paddingBottom: 10,
    paddingLeft: 10,
    borderBottom: `1px solid ${theme.palette.KenColors.assessmentBorder}`,
  },
}));
export default function CaseHistory(props) {
  const { data } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const { config } = React.useContext(configContext);
  const [loading, setLoading] = React.useState(false);
  const [tableLoop, setTableLoop] = useState(Data?.TableData);
  const [tableData, setData] = useState([]);
  const columns = [
    {
      Header: 'Time',
      accessor: 'Time',
      disableGlobalFilter: true,
    },
    {
      Header: 'Actions',
      accessor: 'Actions',
      disableGlobalFilter: true,
    },
    {
      Header: '',
      accessor: 'Feature',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <div className="action-btn-item">
            <KenButton
              className={classes.actionBtn}
              style={{ borderRadius: '50%' }}
              variant="Secondary"
              onClick={() => {}}
            >
              <BsThreeDots />
            </KenButton>
          </div>
        );
      },
    },
  ];
  React.useEffect(() => {
    console.log(data, 'data');
    getCaseHistory(data?.Case_ID).then(res => {
      console.log("res", res)
    });
  });
  return (
    <Box>
      <Grid item md={12}>
        {tableLoop.map((item, key) => {
          return (
            <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
              <div className="caseHistory-table">
                <Typography className={classes.subHead}>
                  {t(`headings: ${Object.keys(item)[0]}`)}
                </Typography>
                <KenGrid
                  columns={columns}
                  data={item[Object.keys(item)[0]]}
                  pagination={{ disabled: true }}
                  tableTotal={{ disabled: true, checkbox: true }}
                  toolbarDisabled={true}
                />
              </div>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}
