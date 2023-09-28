import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import KenCheckboxGroup from '../../../../global_components/KenCheckboxGroup';
import KenInputField from '../../../../global_components/KenInputField';
import KenRadioGroup from '../../../../global_components/KenRadioGroup';
import ScoreSheetHeader from '../ScoreSheetHeader';
import { useHistory, useLocation } from 'react-router-dom';
import {
  getInterviewQuestions,
  postInterviewScore,
} from '../../../../utils/ApiService';
import { useState } from 'react';
import KenButton from '../../../../global_components/KenButton';
import KenLoader from '../../../../components/KenLoader';
import { useSnackbar } from 'notistack';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 18,
    color: theme.palette.KenColors.primary,
    fontWeight: 400,
    marginBottom: 8,
  },
  container: {
    background: theme.palette.KenColors.kenWhite,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.KenColors.kenBlack,
  },
  question: {
    fontWeight: 400,
    fontSize: 12,
    color: theme.palette.KenColors.grey2,
  },
}));

export default function ScoreSheet() {
  const classes = useStyles();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState();
  const userDetails = getUserDetails();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    if (location?.data) {
      // console.log('Data', location?.data);
      setLoader(true);
      getInterviewQuestions(
        location?.data?.applicationId,
        location?.data?.round
      )
        .then(res => {
          const data = res?.data?.map(el => {
            const ques = el?.questions?.map(elem => {
              return { ...elem, questionResponse: null, questionId: elem.id };
            });
            return { ...el, questions: [...ques] };
          });
          setLoader(false);
          setData(data);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    }
  }, []);

  const handleOnChange = (value, questionIndex, elementIndex) => {
    let dataCopy = [...data];
    dataCopy[elementIndex].questions[questionIndex].questionResponse = value;
    setData(dataCopy);
  };

  const handleSubmit = () => {
    const sectionResp = [];
    data?.forEach(el => {
      el.questions.forEach(elem => {
        sectionResp.push({ ...elem, questionId: elem.id });
      });
    });
    const payload = {
      applicationId: location?.data?.applicationId || 'a031y00000AqYLTAA3',
      interviewerId: userDetails?.ContactId,
      interviewRound: location?.data?.round,
      istRecordId: location?.data?.istRecordId,
      sectionResponses: [...data],
    };

    if (sectionResp?.some(el => el.questionResponse === null)) {
      return enqueueSnackbar('Please fill all values', 'warning');
    } else {
      setLoader(true);
      postInterviewScore(payload)
        .then(res => {
          console.log(res);
          if (res.success) {
            history.push('/myStudents');
            setLoader(false);
          }
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    }

    // dataCopy.map(el => {
    //   if (el.questions?.some(el => el.value === null)) {
    //     return enqueueSnackbar('Please fill all values', 'warning');
    //   }
    // });
  };

  const getField = (question, questionIndex, elemIndex) => {
    switch (question?.questionType) {
      case 'Comment': {
        return (
          <KenInputField
            multiline={true}
            required={true}
            minRows={3}
            value={question.questionResponse}
            onChange={e => {
              handleOnChange(e.target.value, questionIndex, elemIndex);
            }}
          />
        );
      }

      case 'Yes/No': {
        const options = [
          { label: 'Yes', value: 'Yes' },
          { label: 'No', value: 'No' },
        ];
        return (
          <KenRadioGroup
            labelPlacement="Start"
            classOverrides={{
              label: classes.radioLabel,
            }}
            onChange={newValue => {
              handleOnChange(newValue, questionIndex, elemIndex);
            }}
            value={question.questionResponse}
            options={options}
          />
        );
      }

      case 'Graded': {
        let options = [];
        for (let i = 1; i <= Number(question?.maxGrade); i++) {
          options.push({ label: `${i}`, value: `${i}` });
        }
        return (
          <KenRadioGroup
            labelPlacement="Start"
            classOverrides={{
              label: classes.radioLabel,
            }}
            onChange={newValue => {
              handleOnChange(newValue, questionIndex, elemIndex);
            }}
            value={question.questionResponse}
            options={options}
          />
        );
      }
    }
  };

  return (
    <div>
      {loader === true && <KenLoader />}
      <Typography style={{ marginBottom: 16 }}>SCORESHEET</Typography>
      <Box p={2} className={classes.container}>
        <Typography className={classes.title}>INTERVIEW SECTION</Typography>
        {data?.length > 0 &&
          data?.map((el, index) => {
            return (
              <>
                <Box mt={2}>
                  <ScoreSheetHeader title={`${el?.sectionLabel} `} />
                </Box>
                <Box mt={2}>
                  {el?.questions?.map((question, questionIndex) => {
                    return (
                      <div style={{ marginBottom: 12 }}>
                        <Typography className={classes.question}>
                          {questionIndex + 1}. {question?.questionLabel}
                        </Typography>
                        {getField(question, questionIndex, index)}
                      </div>
                    );
                  })}
                </Box>
              </>
            );
          })}
      </Box>
      <Box style={{ textAlign: 'right', marginTop: '16px' }}>
        <KenButton
          variant="primary"
          label="Submit"
          onClick={() => {
            handleSubmit();
          }}
        />
      </Box>
    </div>
  );
}
