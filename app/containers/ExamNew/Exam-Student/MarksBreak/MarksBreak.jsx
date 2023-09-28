import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Button, Grid, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { marksBreak } from '../../../../utils/ApiService';
import KenGrid from '../../../../global_components/KenGrid';
import KenLoader from '../../../../components/KenLoader';
import landingpage from '../../../../assets/landingpage.png';
import KenSelect from '../../../../global_components/KenSelect';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  termSelect: {
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(2),
    },
  },
  buttonContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: '22px',
  },
  content: {
    fontWeight: 600,
    fontSize: '24px',
    marginTop: '16px',
  },
  content1: {
    color: 'black',
    fontWeight: 500,
    fontSize: '18px',
  },
}));

const MarksBreak = () => {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const contactId = userDetails?.ContactId;

    const fetchData = async () => {
      try {
        const response = await marksBreak(contactId);
        setLoading(true);
        if (response && response.length > 0) {
          const mappedData = response.map(item => ({
            courseName: item.hed__Course_Offering__r.hed__Course__r.Name,
            courseCode:
              item.hed__Course_Offering__r.hed__Course__r.hed__Course_ID__c,
            credits: item.hed__Course_Offering__r.hed__Course__r.Credits__c,
            finalGrade: 'A',
            actions: '',
            termCode: item.Term_Code__c,
          }));
          setData(mappedData);
          setFilteredData(mappedData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (contactId) {
      fetchData();
    }
  }, []);

  const handleTermChange = event => {
    setSelectedTerm(event.target.value);
  };

  const handleApplyFilter = () => {
    if (selectedTerm === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => item.termCode === selectedTerm);
      setFilteredData(filtered);
    }
  };

  const isApplyButtonDisabled = selectedTerm === '';

  const handleClearFilter = () => {
    setSelectedTerm('');
    setFilteredData(data);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Course',
        accessor: 'courseName',
      },
      {
        Header: 'Course Code',
        accessor: 'courseCode',
      },
      {
        Header: 'Credits',
        accessor: 'credits',
      },
      {
        Header: 'Final Grade',
        accessor: 'finalGrade',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <VisibilityIcon
            onClick={() => handleRowClick(row.original)}
            style={{ cursor: 'pointer', color: '#090F69' }}
          />
        ),
      },
    ],
    []
  );

  const handleRowClick = rowData => {
    history.push(`/MarksBreakDownPre`);
  };

  const termOptions = [
    { value: '2023-JAN-GMBA-Term-1', label: '2023-JAN-GMBA-Term-1' },
  ];

  return (
    <div>
      {/* {loading && <KenLoader />} */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        className={classes.container}
      >
        <Grid item xs={12} md={2}>
          <KenSelect
            id="term-select"
            options={termOptions}
            value={selectedTerm}
            onChange={handleTermChange}
            placeholder="Select Term"
            label="Term"
            fullWidth
            className={classes.termSelect}
          />
        </Grid>
        <Grid item xs={12} md={8} className={classes.buttonContainer}>
          <Button
            style={{ textTransform: 'capitalize' }}
            variant="contained"
            color="primary"
            onClick={handleApplyFilter}
            disabled={isApplyButtonDisabled}
          >
            Apply
          </Button>
          <Button
            style={{
              textTransform: 'capitalize',
              background: 'white',
              color: '#090F69',
            }}
            variant="contained"
            // color="secondary"
            onClick={handleClearFilter}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
      {selectedTerm === '' ? (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <img src={landingpage} />
          <Typography className={classes.content}>
            No details selected!
          </Typography>{' '}
          <br />
          <Typography className={classes.content1}>
            Select Term to view the details of Course.
          </Typography>
        </div>
      ) : (
        <KenGrid
          columns={columns}
          data={filteredData}
          toolbarDisabled={true}
          pagination={{ disabled: false }}
        />
      )}
    </div>
  );
};

export default MarksBreak;
