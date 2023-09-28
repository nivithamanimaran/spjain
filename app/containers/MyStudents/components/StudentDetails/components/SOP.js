import React, { useEffect } from 'react';
import { getSOPDetailsByApplicationId } from '../../../../../utils/ApiService';
import { useLocation } from 'react-router-dom';
import KenCard from '../../../../../global_components/KenCard';
import KenAccordion from '../../../../../components/KenAccordion';
import { Typography } from '@material-ui/core';
import { useState } from 'react';
import KenLoader from '../../../../../components/KenLoader';

export default function SOP() {
  const location = useLocation();
  const [data, setData] = useState();
  const [loader, setLoader] = useState();
  const query = new URLSearchParams(location.search);
  const applicationId = query.get('applicationId');

  const fetchData = async () => {
    try {
      setLoader(true);
      const res = await getSOPDetailsByApplicationId(applicationId);
      if (res) {
        setData(res && res[0]);
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      {loader && <KenLoader />}
      <KenCard>
        {data ? (
          <>
            <KenAccordion label={'ESSAY'}>
              <Typography>{data?.Essay__c}</Typography>
            </KenAccordion>
            <KenAccordion label={'SOP'}>
              <Typography>{data?.SOP__c}</Typography>
            </KenAccordion>
          </>
        ) : (
          <Typography>No Data Found</Typography>
        )}
      </KenCard>
    </React.Fragment>
  );
}
