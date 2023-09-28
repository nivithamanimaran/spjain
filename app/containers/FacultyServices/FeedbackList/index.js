import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  makeStyles,
  Button,
  Typography,
} from '@material-ui/core';
// import '../App/styles.scss';
import KenButton from '../../../global_components/KenButton';
import KenGrid from '../../../global_components/KenGrid';
import KenLoader from '../../../components/KenLoader';
import KenCard from '../../../global_components/KenCard';
import KenHeader from '../../../global_components/KenHeader/index';
import KenSelect from '../../../components/KenSelect';
// import KenTabs from '../../components/KenTabs';
import { useTranslation } from 'react-i18next';
import Data from './data.json';
// import history from '../../utils/history';
import configContext from '../../../utils/helpers/configHelper';
import { BsThreeDots } from 'react-icons/bs';
import PreviewPage from './Components/index';
import '../styles.scss';
import { getBookRequest } from '../../../utils/ApiService'; //getDashboardCases
import { getUserDetails } from '../../../utils/helpers/storageHelper';
import moment from 'moment';
import { GrClose } from 'react-icons/gr';
import FeedbackForm from '../FeedbackForm';

const useStyles = makeStyles(theme => ({
  headBox: {
    backgroundColor: theme.palette.KenColors.kenWhite,
  },
  heading: {
    color: theme.palette.KenColors.neutral900,
    fontWeight: '600',
  },
  subHead: {
    fontSize: 12,
    paddingRight: 15,
    color: theme.palette.KenColors.neutral900,
  },
  actionBtn: {
    borderRadius: '50%',
  },
}));
export default function ServiceList(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { config } = React.useContext(configContext);
  const { homePage } = props;
  const [showFilter, setShowFilter] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false); // change to false
  const [previewData, setPreviewData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [tableData, setData] = useState([]);
  const [selectOptions] = useState(['All']);
  const [feedbackPreview ,setFeedbackPreview]=React.useState(false);
  const columns = [
    {
      Header: 'Subject',
      accessor: 'Subject',
      disableGlobalFilter: true,
    },
    {
      Header: 'Total number of Feedback Forms',
      accessor: 'total_feedback',
      disableGlobalFilter: true,
    },
    // {
    //   Header: 'Actions',
    //   accessor: 'Actions',
    //   disableGlobalFilter: true,
    //   Cell: ({ value, row }) => {
    //     return (
    //       <div className="action-btn-item">
    //         <KenButton
    //           className={classes.actionBtn}
    //           style={{ borderRadius: '50%' }}
    //           variant="Secondary"
    //           onClick={() => {}}
    //         >
    //           <BsThreeDots />
    //         </KenButton>
    //       </div>
    //     );
    //   },
    // },
  ];
  const columns2 =[
    {
      Header: 'From ID',
      accessor: 'From ID',
      disableGlobalFilter: true,
    },
    {
      Header: 'Overall Point Scale',
      accessor: 'total_feedback',
      disableGlobalFilter: true,
    },
    // {
    //   Header: 'Actions',
    //   accessor: 'Actions',
    //   disableGlobalFilter: true,
    //   Cell: ({ value, row }) => {
    //     return (
    //       <div className="action-btn-item">
    //         <KenButton
    //           className={classes.actionBtn}
    //           style={{ borderRadius: '50%' }}
    //           variant="Secondary"
    //           onClick={() => {}}
    //         >
    //           <BsThreeDots />
    //         </KenButton>
    //       </div>
    //     );
    //   },
    // },
  ];

  React.useEffect(() => {
    if (homePage != undefined) {
      setShowFilter(true);
    } else {
      setShowFilter(false);
    }
    const contactId = getUserDetails().ContactId;
    setLoading(true);
    getBookRequest(contactId).then(res => {
      let data = [{
        Subject:"MBA",
        'total_feedback':"2",
        'From ID':"F001"
      }];
      res?.map(item => {
        data.push({
          hed__Category__c: item.hed__Category__c ? item.hed__Category__c : "-",
          Case_No: item.CaseNumber ? item.CaseNumber : '-',
          Service_Type: item.Type ? item.Type: "-",
          Subject: item.Subject ? item.Subject : "-",
          Description: item.Description ? item.Description : '-',
          Date: item.CreatedDate ? moment(item.CreatedDate).format('DD/MM/YYYY') : "-",
          Status: item.Status ? item.Status : "-",
          Case_ID: item.Id ? item.Id : '-',
        });
      });
      setData(data);
      setLoading(false);
    });
  }, []);
  const onPreview = props => {
    console.log('service list', props);
    setPreviewData(props);
    setShowPreview(true);
  };
  const onPreview2 = props => {
    console.log('service list', props);
    // setPreviewData(props);
    // setShowPreview(true);
    setFeedbackPreview(true)
  };
  const closePreview = props => {
    setShowPreview(props);
  };
  return (
    <>
      <Box>
        {loading && <KenLoader />}
        {!showPreview ? (
          <>
            {!showFilter ? (
              <Grid item md={12}>
                <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
                  <Box mb={1}>
                    <KenHeader
                      title={
                        <Typography className={classes.heading}>
                          {t('headings:SERVICE LIST')}
                        </Typography>
                      }
                    >
                      <Typography className={classes.subHead}>
                        {t('headings: Service Sub-Type')}
                      </Typography>
                      <div className="input-field-item">
                        <KenSelect
                          placeholder="Select"
                          inputBaseRootClass={classes.inputBaseClass}
                          className={classes.selectDrawer}
                          options={selectOptions}
                          name="serviceSubType"
                          value="All"
                          variant="outline"
                        />
                      </div>
                    </KenHeader>
                  </Box>
                </Box>
              </Grid>
            ) : null}
            <Grid item md={12}>
            <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
                <Box mb={1}>
                  <KenHeader
                    title={
                      <Typography className={classes.heading}>
                        {t('headings:Feeback Form')}
                      </Typography>
                    }
                  >
                  </KenHeader>
                </Box>
              </Box>
              <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
                <Box pt={2} pb={2} pl={2} pr={2}>
                  <KenCard paperStyles={{ padding: 16 }}>
                    <div className="case-details-table">
                      <KenGrid
                        columns={columns}
                        data={tableData}
                        pagination={{ disabled: true }}
                        tableTotal={{ disabled: true, checkbox: true }}
                        gridProps={{
                          getRowProps: row => ({
                            onClick: () => onPreview(row.original),
                          }),
                        }}
                        toolbarDisabled={true}
                      />
                    </div>
                  </KenCard>
                </Box>
              </Box>
            </Grid>
          </>
        ) : ( <>
        
       
         { feedbackPreview ? (
          <>
           <div className='caseTabs-main' style={{padding:10}}>
                <div className='caseTabs-subhead' style={{display: 'flex', width: '100%', justifyContent: 'space-between', padding: '5px 10px'}}>
                    <Typography className={classes.heading}>
                    {t('headings:Feeback Form')}
                    </Typography>
                    <div className='caseTabs-closeBtn'>
                        <KenButton variant="secondary" onClick={() => setFeedbackPreview(!feedbackPreview)} ><GrClose /></KenButton>
                    </div>
                </div>
            </div>
          <Grid sm={12} x={12}>
                    <form className={classes.feebackform}>
                      <div className="formCaseWrap">
                        <FeedbackForm />
                      </div>
                    </form>
                  </Grid> 
    
            </> ) :(
          <>
            {/* <Grid item md={12}>
              <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
                <Box mb={1}>
                  <PreviewPage data={previewData} closePreview={closePreview} />
                 
                </Box>
              </Box>
            </Grid> */}
             <div className='caseTabs-main'style={{padding:10}}>
                <div className='caseTabs-subhead' style={{display: 'flex', width: '100%', justifyContent: 'space-between', padding: '5px 10px'}}>
                    <Typography className={classes.heading}>
                    {t('headings:Feeback Form')}
                    </Typography>
                    <div className='caseTabs-closeBtn'>
                        <KenButton variant="secondary" onClick={() => setShowPreview(!showPreview)} ><GrClose /></KenButton>
                    </div>
                </div>
            </div>
            <Grid item md={12}>
              <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
                <Box pt={2} pb={2} pl={2} pr={2}>
                  <KenCard paperStyles={{ padding: 16 }}>
                    <div className="case-details-table">
                      <KenGrid
                        columns={columns2}
                        data={tableData}
                        pagination={{ disabled: true }}
                        tableTotal={{ disabled: true, checkbox: true }}
                        gridProps={{
                          getRowProps: row => ({
                            onClick: () => onPreview2(row.original),
                          }),
                        }}
                        toolbarDisabled={true}
                      />
                    </div>
                  </KenCard>
                </Box>
              </Box>
            </Grid>
          </>
          )}
          </>
        )}
      </Box>
    </>
  );
}
