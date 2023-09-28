import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Paper,
  Typography,
  makeStyles,
  Button,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KenInputField from '../../../components/KenInputField';
import { AiOutlineDown } from 'react-icons/ai';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineCamera, AiOutlineEdit } from 'react-icons/ai';
import {
  saveStudentAddressInfo,
  saveStudentEducationInfo,
  saveStudentProfileInfo,
  saveStudentRelationInfo,
} from '../../../utils/ApiService';
import './profile.css';

const useStyles = makeStyles(theme => ({
  parentRoot: {
    borderRadius: '3px',
    margin: '32px 0px 32px 0px',
    position: 'relative',
  },
  circle: {
    width: '100px',
    height: '100px',
    lineHeight: '100px',
    borderRadius: '50%',
    color: theme.palette.KenColors.shadowColor,
    textAlign: 'center',
    background: `${theme.palette.KenColors.neutral100}`,
    fontSize: 'xxx-large',
  },
  profile: {
    position: 'absolute',
    top: '32px',
    left: '0px',
    right: '0px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  studentName: {
    fontWeight: 600,
    fontSize: '16px',
    color: theme.palette.KenColors.neutral900,
    marginTop: '8px',
  },
  rectangle: {
    height: '50px',
    background: 'linear-gradient(96.64deg, #B3D4FF 3.24%, #FED9D7 95.61%)',
    marginLeft: 10,
  },
  profileContainer: {
    position: 'relative',
  },
  heading: {
    padding: '16px',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '20px',
    color: theme.palette.KenColors.neutral100,
  },
  divInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  img: {
    padding: '0px 16px 16px 16px',
  },
  info: {
    marginBottom: 10,
    fontSize: '12px',
    color: `${theme.palette.KenColors.primary}`,
  },
  divider: {
    margin: '0px 0px 10px 0px',
  },
  menuItemDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    '&:hover': {
      cursor: 'pointer',
      background: theme.palette.KenColors.neutral40,
    },
  },
  av: {
    width: '36px',
    height: '36px',
    lineHeight: '33px',
    borderRadius: '55%',
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    background: `${theme.palette.KenColors.neutral100}`,
  },
  titleDetails: {
    color: `${theme.palette.KenColors.neutral400}`,
    fontSize: 10,
  },
  plainLink: {
    textDecoration: 'none',
    '&:hover': {
      cursor: 'pointer',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      margin: '30px',
    },
  },
  activeMenuItem: {
    borderLeft: `3px solid ${theme.palette.KenColors.cardActiveBorderColor}`,
    borderRadius: 4,
    backgroundColor: theme.palette.KenColors.cardActiveBackground,
    '& $titleName': {
      color: theme.palette.KenColors.cardActiveColor,
    },
  },
}));
const PersonalDetails = ({
  profileUpdate,
  educationUpdate,
  addressUpdate,
  relationship,
  setEducationUpdate,
  setAddressUpdate,
  setRelationShip,
  details,
  setDetails,
  expandeds,
  setExpanded,
  relationshipDetails,
  state,
  setState,
  setRelationShipDetails,
  addressDetails,
  setAddressDetails,
}) => {
  console.log('addressDetails', addressDetails);
  const [detailPage, setDetailPage] = useState(details);
  const [educationAcc, setEducationAcc] = useState(false);
  const [addressBtn, setAddressBtn] = useState(false);
  const [relationshipBtn, setRelationshipBtn] = useState(false);

  const [data, setData] = useState(state);

  const [addressAcc, setAddressAcc] = useState(false);
  const [idAcc, setIdAcc] = useState(false);
  const [relationshipAcc, setRelationshipAcc] = useState(false);
  const [relationShipPage, setRelationShipPage] = useState(relationshipDetails);
  const [addressPage, setAddressPage] = useState(addressDetails);

  useEffect(() => {
    setData(state);
    // getProfileImage();
  }, [state]);

  const handleChangeInput = (evt, i) => {
    const value = evt.target.value;
    setDetailPage(
      detailPage.map((e, index) => {
        if (i == index) {
          return { ...e, [evt.target.name]: evt.target.value };
        } else {
          return e;
        }
      })
    );
  };

  const handleChangeInputAddress = (evt, i) => {
    const value = evt.target.value;
    setAddressPage(
      addressPage.map((e, index) => {
        if (i == index) {
          return {
            ...e,
            add: { ...e.add, [evt.target.name]: evt.target.value },
          };
        } else {
          return { ...e, add: e.add };
        }
      })
    );
  };
  const handleChangeRelation = (evt, i) => {
    console.log('evt.name', evt);
    setRelationShipPage(
      relationShipPage.map((e, index) => {
        if (i == index) {
          return {
            ...e,
            res: { ...e.res, [evt.target.name]: evt.target.value },
          };
        } else {
          return { ...e, res: e.res };
        }
      })
    );
  };
  const handleRelation = () => {
    // setRelationShip(true);
  };

  const handleAddress = () => {
    // setAddressUpdate(true);
  };

  const handleChangeAccordien = () => {
    setExpanded(!expandeds);
  };
  useEffect(() => {
    setDetailPage(details);
    setAddressPage(addressDetails);
    setRelationShipPage(relationshipDetails);
    if (relationShipPage.length > 2) {
      setRelationshipBtn(false);
    } else {
      setRelationshipBtn(true);
    }
    if (addressPage.length > 2) {
      setAddressBtn(false);
    } else {
      setAddressBtn(true);
    }
  }, [details, relationshipDetails, addressDetails]);
  const handleSaveEducation = () => {
    saveStudentEducationInfo(detailPage);
    setEducationAcc(false);
  };

  const handleSaveRelation = () => {
    saveStudentRelationInfo(relationShipPage);
    setRelationshipAcc(!relationshipAcc);
  };

  const handleSaveAddress = () => {
    console.log('addressPage', addressPage);
    saveStudentAddressInfo(addressPage);
    setAddressAcc(false);
  };

  function handleChangeInputs(evt) {
    const value = evt.target.value;
    setData({
      ...data,
      [evt.target.name]: value,
    });
  }
  const addAddress = () => {
    setAddressPage([
      ...addressPage,
      {
        add: {
          attributes: {
            type: 'hed__Address__c',
            url:
              '/services/data/v54.0/sobjects/hed__Address__c/a001y000005iriyAAA',
          },
          Id: null,
          Name: 'A-01790',
          hed__Address_Type__c: 'Temporary',
          hed__Default_Address__c: false,
          hed__Geolocation__c: null,
          Is_Permanent_Address_Same__c: false,
          House_Flat_No__c: '',
          hed__Formula_MailingAddress__c: '',
          hed__MailingCity__c: '',
          hed__MailingStreet__c: '',
          hed__Formula_MailingStreetAddress__c:
            'Haudin Streetss<br>Banglores,  50000123<br>India',
          hed__MailingPostalCode__c: '',
          hed__Parent_Contact__c: '0031y00000LptICAAZ',
        },
      },
    ]);
  };

  const saveIdDetails = () => {
    console.log('saveStudentProfileInfo(data);', data);
    saveStudentProfileInfo(data);
    setIdAcc(false);
  };
  const addRelationship = () => {
    console.log('relationShipPage', relationShipPage);
    setRelationShipPage([
      ...relationShipPage,
      {
        res: {
          attributes: {
            type: 'hed__Relationship__c',
            url:
              '/services/data/v54.0/sobjects/hed__Relationship__c/a0N1y000003WFh2EAG',
          },
          Id: null,
          Name: 'R-002868',
          hed__Contact__c: '0031y00000LptICAAZ',
          hed__RelatedContact__c: '0031y00000LpwM2AAJ',
          hed__Type__c: '',
          hed__Status__c: 'Current',
          Currency_type__c: '',
          Language_Spoken_at_Home__c: '',
          hed__Contact__r: {
            attributes: {
              type: 'Contact',
              url: '/services/data/v54.0/sobjects/Contact/0031y00000LptICAAZ',
            },
            Id: '0031y00000LptICAAZ',
            Name: 'Nikitas Sivakumars',
          },
          hed__RelatedContact__r: {
            attributes: {
              type: 'Contact',
              url: '/services/data/v54.0/sobjects/Contact/0031y00000LpwM2AAJ',
            },
            Id: '0031y00000LpwM2AAJ',
            Name: 'mona mohapatra',
          },
        },
      },
    ]);
  };
  const classes = useStyles();
  return (
    <div>
      <Accordion
        style={{ marginBottom: '10px' }}
        // expanded={expandeds}
        // onChange={() => handleChangeAccordien()}
      >
        <AccordionSummary
          expandIcon={<AiOutlineDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>EDUCATION DETAILS</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '8px 16px 30px 65px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={11}>
              <h3>12th Level Details:</h3>
            </Grid>

            <Grid item xs={12} sm={1} className="editButton">
              {educationAcc ? (
                <Button
                  className="save"
                  variant="contained"
                  color="primary"
                  onClick={() => handleSaveEducation()}
                >
                  Save
                </Button>
              ) : (
                <AiOutlineEdit
                  size={23}
                  onClick={() => setEducationAcc(true)}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="12th Level"
                  name="Level__c"
                  value={detailPage[0]?.Level__c}
                  dropdownColor="#FFFFFF"
                  // type="file"
                  onChange={e => {
                    handleChangeInput(e, 0);
                  }}
                />
              ) : (
                <>
                  <Typography>
                    <b>Level</b>
                  </Typography>
                  <br />
                  {detailPage[0]?.Level__c}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="School Name"
                  name="hed__Educational_Institution_Name__c"
                  value={detailPage[0]?.hed__Educational_Institution_Name__c}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInput(e, 0);
                  }}
                />
              ) : (
                <>
                  <Typography>
                    <b>School</b>
                  </Typography>
                  <br />
                  {detailPage[0]?.hed__Educational_Institution_Name__c}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="Country"
                  name="Country__c"
                  value={detailPage[0]?.Country__c}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInput(e, 0);
                  }}
                />
              ) : (
                <>
                  <Typography>
                    <b>Country</b>
                  </Typography>
                  <br />
                  {detailPage[0]?.Country__c}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="Year of Passing"
                  name="Year_of_Passing__c"
                  value={detailPage[0]?.Year_of_Passing__c}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInput(e, 0);
                  }}
                />
              ) : (
                <>
                  <Typography>
                    <b>Year of Passing</b>
                  </Typography>
                  <br />
                  {detailPage[0]?.Year_of_Passing__c}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <h3>Graduate level Details:</h3>
            </Grid>
            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="Graduate Level"
                  name="Level__c"
                  value={detailPage[1]?.Level__c}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInput(e, 1);
                  }}
                />
              ) : (
                <>
                  <Typography>
                    <b>Graduate Level</b>
                  </Typography>
                  <br />
                  {detailPage[1]?.Level__c}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="College"
                  name="hed__Educational_Institution_Name__c"
                  value={detailPage[1]?.hed__Educational_Institution_Name__c}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInput(e, 1);
                  }}
                />
              ) : (
                <>
                  <Typography>
                    <b>College</b>
                  </Typography>
                  <br />
                  {detailPage[1]?.hed__Educational_Institution_Name__c}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="Country"
                  name="Country__c"
                  value={detailPage[1]?.Country__c}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInput(e, 1);
                  }}
                />
              ) : (
                <>
                  <Typography>
                    <b>Country</b>
                  </Typography>
                  <br />
                  {detailPage[1]?.Country__c}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="Year of Passing"
                  name="Year_of_Passing__c"
                  value={detailPage[1]?.Year_of_Passing__c}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInput(e, 1);
                  }}
                />
              ) : (
                <>
                  <Typography>
                    <b>Year of Passing</b>
                  </Typography>
                  <br />
                  {detailPage[1]?.Year_of_Passing__c}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <h3>Post Graduate Level Details:</h3>
            </Grid>
            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="Post Graduate Level"
                  name="Level__c"
                  value={detailPage[2]?.Level__c}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInput(e, 2);
                  }}
                />
              ) : (
                <>
                  <Typography>
                    <b>Graduate Level</b>
                  </Typography>
                  <br />
                  {detailPage[2]?.Level__c}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="College"
                  name="hed__Educational_Institution_Name__c"
                  value={detailPage[2]?.hed__Educational_Institution_Name__c}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInput(e, 2);
                  }}
                />
              ) : (
                <>
                  <Typography>
                    <b>College</b>
                  </Typography>
                  <br />
                  {detailPage[2]?.hed__Educational_Institution_Name__c}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="Country"
                  name="Country__c"
                  value={detailPage[2]?.Country__c}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInput(e, 2);
                  }}
                  required
                />
              ) : (
                <>
                  <Typography>
                    <b>Country</b>
                  </Typography>
                  <br />
                  {detailPage[2]?.Country__c}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              {educationAcc ? (
                <KenInputField
                  label="Year_of_Passing"
                  name="Year_of_Passing__c"
                  value={detailPage[2]?.Year_of_Passing__c}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInput(e, 2);
                  }}
                />
              ) : (
                <>
                  <Typography>
                    <b>Year of Passing</b>
                  </Typography>
                  <br />
                  {detailPage[2]?.Year_of_Passing__c}
                </>
              )}
            </Grid>
          </Grid>
          {/* </Paper> */}
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ marginBottom: '10px' }}>
        <AccordionSummary
          expandIcon={<AiOutlineDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>ADDRESS DETAILS</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '8px 16px 30px 65px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={11} />
            <Grid item xs={12} sm={1} className="editButton">
              {addressAcc ? (
                <Button
                  className="save"
                  variant="contained"
                  color="primary"
                  onClick={() => handleSaveAddress()}
                >
                  Save
                </Button>
              ) : (
                <AiOutlineEdit size={23} onClick={() => setAddressAcc(true)} />
              )}
            </Grid>
            {addressPage.map((addressEle, ind) => {
              return (
                <Grid container spacing={2}>
                  {addressEle.add.hed__Address_Type__c == 'Permanent' && (
                    <>
                      <Grid item xs={12} sm={11}>
                        <h3>PERMANENT ADDRESS</h3>
                      </Grid>
                      <Grid item xs={10} sm={3}>
                        {addressAcc ? (
                          <KenInputField
                            label="House/Flat No"
                            name="House_Flat_No__c"
                            value={addressEle.add.House_Flat_No__c}
                            dropdownColor="#FFFFFF"
                            onChange={e => {
                              handleChangeInputAddress(e, ind);
                            }}
                          />
                        ) : (
                          <>
                            <Typography>
                              <b>House/Flat No</b>
                            </Typography>
                            <br />
                            {addressEle.add.House_Flat_No__c}
                          </>
                        )}
                      </Grid>
                      <Grid item xs={10} sm={2}>
                        {addressAcc ? (
                          <KenInputField
                            label="Road"
                            name="hed__MailingStreet__c"
                            value={addressEle.add.hed__MailingStreet__c}
                            dropdownColor="#FFFFFF"
                            onChange={e => {
                              handleChangeInputAddress(e, ind);
                            }}
                          />
                        ) : (
                          <>
                            <Typography>
                              <b>Road</b>
                            </Typography>
                            <br />
                            {addressEle.add.hed__MailingStreet__c}
                          </>
                        )}
                      </Grid>
                      <Grid item xs={10} sm={2}>
                        {addressAcc ? (
                          <KenInputField
                            label="Suburb"
                            name="hed__MailingCity__c"
                            value={addressEle.add.hed__MailingCity__c}
                            dropdownColor="#FFFFFF"
                            onChange={e => {
                              handleChangeInputAddress(e, ind);
                            }}
                          />
                        ) : (
                          <>
                            <Typography>
                              <b>Suburb</b>
                            </Typography>
                            <br />
                            {addressEle.add.hed__MailingCity__c}
                          </>
                        )}
                      </Grid>
                      <Grid item xs={10} sm={2}>
                        {addressAcc ? (
                          <KenInputField
                            label="Country"
                            name="hed__Formula_MailingAddress__c"
                            value={addressEle.add.hed__Formula_MailingAddress__c
                              .split('<br>')
                              .pop()}
                            dropdownColor="#FFFFFF"
                            onChange={e => {
                              handleChangeInputAddress(e, ind);
                            }}
                          />
                        ) : (
                          <>
                            <Typography>
                              <b>Country</b>
                            </Typography>
                            <br />
                            {addressEle.add.hed__Formula_MailingAddress__c}
                          </>
                        )}
                      </Grid>
                      <Grid item xs={10} sm={2}>
                        {addressAcc ? (
                          <KenInputField
                            label="Pincode"
                            name="hed__MailingPostalCode__c"
                            value={addressEle.add.hed__MailingPostalCode__c}
                            dropdownColor="#FFFFFF"
                            onChange={e => {
                              handleChangeInputAddress(e, ind);
                            }}
                          />
                        ) : (
                          <>
                            <Typography>
                              <b>Pincode</b>
                            </Typography>
                            <br />
                            {addressEle.add.hed__MailingPostalCode__c}
                          </>
                        )}
                      </Grid>
                    </>
                  )}

                  {addressEle.add.hed__Address_Type__c == 'Temporary' && (
                    <>
                      <Grid item xs={12} sm={12}>
                        <h3>TEMPORARY ADDRESS</h3>
                      </Grid>
                      <Grid item xs={10} sm={3}>
                        {addressAcc ? (
                          <KenInputField
                            label="House/Flat No"
                            name="House_Flat_No__c"
                            value={addressEle.add.House_Flat_No__c}
                            dropdownColor="#FFFFFF"
                            onChange={e => {
                              handleChangeInputAddress(e, ind);
                            }}
                            required
                          />
                        ) : (
                          <>
                            <Typography>
                              <b>House/Flat No</b>
                            </Typography>
                            <br />
                            {addressEle.add.House_Flat_No__c}
                          </>
                        )}
                      </Grid>
                      <Grid item xs={10} sm={2}>
                        {addressAcc ? (
                          <KenInputField
                            label="Road"
                            name="hed__MailingStreet__c"
                            value={addressEle.add.hed__MailingStreet__c}
                            dropdownColor="#FFFFFF"
                            onChange={e => {
                              handleChangeInputAddress(e, ind);
                            }}
                            required
                          />
                        ) : (
                          <>
                            <Typography>
                              <b>Road</b>
                            </Typography>
                            <br />
                            {addressEle.add.hed__MailingStreet__c}
                          </>
                        )}
                      </Grid>
                      <Grid item xs={10} sm={2}>
                        {addressAcc ? (
                          <KenInputField
                            label="Suburb"
                            name="hed__MailingCity__c"
                            value={addressEle.add.hed__MailingCity__c}
                            dropdownColor="#FFFFFF"
                            onChange={e => {
                              handleChangeInputAddress(e, ind);
                            }}
                            required
                          />
                        ) : (
                          <>
                            <Typography>
                              <b>Suburb</b>
                            </Typography>
                            <br />
                            {addressEle.add.hed__MailingCity__c}
                          </>
                        )}
                      </Grid>
                      <Grid item xs={10} sm={2}>
                        {addressAcc ? (
                          <KenInputField
                            label="Country"
                            name="hed__Formula_MailingAddress__c"
                            value={
                              addressEle.add.hed__Formula_MailingAddress__c
                            }
                            dropdownColor="#FFFFFF"
                            onChange={e => {
                              handleChangeInputAddress(e, ind);
                            }}
                            required
                          />
                        ) : (
                          <>
                            <Typography>
                              <b>Country</b>
                            </Typography>
                            <br />
                            {addressEle.add.hed__Formula_MailingAddress__c}
                          </>
                        )}
                      </Grid>
                      <Grid item xs={10} sm={2}>
                        {addressAcc ? (
                          <KenInputField
                            name="hed__MailingPostalCode__c"
                            label="Pincode"
                            value={addressEle.add.hed__MailingPostalCode__c}
                            // value={dataStream.hed__MailingPostalCode__c}
                            dropdownColor="#FFFFFF"
                            onChange={e => {
                              handleChangeInputAddress(e, ind);
                            }}
                            required
                          />
                        ) : (
                          <>
                            <Typography>
                              <b>Pincode</b>
                            </Typography>
                            <br />
                            {addressEle.add.hed__MailingPostalCode__c}
                          </>
                        )}
                      </Grid>
                    </>
                  )}
                </Grid>
              );
            })}
            {addressAcc && (
              <>
                <Grid item xs={12} sm={10} />{' '}
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AiOutlinePlus />}
                    onClick={e => addAddress(e)}
                    // disabled={addressBtn}
                    // startIcon={<AiOutlinePlus />}
                  >
                    Add Address
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
          {/* <Button variant='contained'>Add Address</Button> */}
        </AccordionDetails>
      </Accordion>{' '}
      <Accordion style={{ marginBottom: '10px' }}>
        <AccordionSummary
          expandIcon={<AiOutlineDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>ID DETAILS</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '8px 16px 30px 65px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={11}>
              <h3>National ID Number</h3>
            </Grid>
            <Grid item xs={12} sm={1} className="editButton">
              {idAcc ? (
                <Button
                  variant="contained"
                  className="save"
                  color="primary"
                  onClick={() => saveIdDetails()}
                >
                  Save
                </Button>
              ) : (
                <AiOutlineEdit size={23} onClick={() => setIdAcc(true)} />
              )}
            </Grid>
            <Grid item xs={10} sm={3}>
              {idAcc ? (
                <KenInputField
                  label="Passport Number"
                  name="PassportNumber"
                  value={data.PassportNumber}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInputs(e);
                  }}
                  required
                />
              ) : (
                <>
                  <Typography>
                    <b>Passport Number</b>
                  </Typography>
                  <br />
                  {data.PassportNumber}
                </>
              )}
            </Grid>
            <Grid item xs={10} sm={3}>
              {idAcc ? (
                <KenInputField
                  label="National Id Number"
                  name="NationalIdNumber"
                  value={data.NationalIdNumber}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInputs(e);
                  }}
                  required
                />
              ) : (
                <>
                  <Typography>
                    <b>National Id Number</b>
                  </Typography>
                  <br />
                  {data.NationalIdNumber}
                </>
              )}
            </Grid>
            <Grid item xs={10} sm={3}>
              {idAcc ? (
                <KenInputField
                  label="TAX File Number(only for Australians)"
                  name="TaxFileNum"
                  value={data.TaxFileNum}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInputs(e);
                  }}
                  required
                />
              ) : (
                <>
                  <Typography>
                    <b>TAX File Number(only for Australians)</b>
                  </Typography>
                  <br />
                  {data.TaxFileNum}
                </>
              )}
            </Grid>
            <Grid item xs={10} sm={3}>
              {idAcc ? (
                <KenInputField
                  label="Emirates Id Number"
                  name="EmiratesIdNum"
                  value={data.EmiratesIdNum}
                  // value={dataStream.EmiratesIdNum}
                  dropdownColor="#FFFFFF"
                  onChange={e => {
                    handleChangeInputs(e);
                  }}
                  required
                />
              ) : (
                <>
                  <Typography>
                    <b>Emirates Id Number</b>
                  </Typography>
                  <br />
                  {data.EmiratesIdNum}
                </>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>{' '}
      <Accordion
        // expanded={expandeds}
        // onChange={() => handleChangeAccordien()}
        style={{ marginBottom: '10px' }}
      >
        <AccordionSummary
          expandIcon={<AiOutlineDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>RELATIONSHIP</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '8px 16px 30px 65px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={11} />
            <Grid item xs={12} sm={1} className="editButton">
              {relationshipAcc ? (
                <Button
                  className="save"
                  variant="contained"
                  color="primary"
                  onClick={() => handleSaveRelation()}
                >
                  Save
                </Button>
              ) : (
                <AiOutlineEdit
                  size={23}
                  onClick={() => setRelationshipAcc(true)}
                />
              )}
            </Grid>
            {relationShipPage.map((relData, index) => {
              return (
                <>
                  <Grid item xs={12} sm={12}>
                    <h3>Parent {index + 1}</h3>
                  </Grid>

                  <Grid item xs={10} sm={4}>
                    {relationshipAcc ? (
                      <KenInputField
                        label="Parent Information"
                        name="hed__Type__c"
                        value={relData.res.hed__Type__c}
                        dropdownColor="#FFFFFF"
                        onChange={e => handleChangeRelation(e, index)}
                      />
                    ) : (
                      <>
                        <Typography>
                          <b>Parent Information</b>
                        </Typography>
                        <br />
                        {relData.res.hed__Type__c}
                      </>
                    )}
                  </Grid>
                  <Grid item xs={10} sm={4}>
                    {relationshipAcc ? (
                      <KenInputField
                        label="Qualification"
                        name="Currency_type__c"
                        value={relData.res.Currency_type__c}
                        dropdownColor="#FFFFFF"
                        onChange={e => handleChangeRelation(e, index)}
                      />
                    ) : (
                      <>
                        <Typography>
                          <b>Qualification</b>
                        </Typography>
                        <br />
                        {relData.res.Currency_type__c}
                      </>
                    )}
                  </Grid>
                  <Grid item xs={10} sm={4}>
                    {relationshipAcc ? (
                      <KenInputField
                        label="language Spoken at home"
                        name="Language_Spoken_at_Home__c"
                        value={relData.res.Language_Spoken_at_Home__c}
                        dropdownColor="#FFFFFF"
                        onChange={e => handleChangeRelation(e, index)}
                      />
                    ) : (
                      <>
                        <Typography>
                          <b>Language Spoken At Home</b>
                        </Typography>
                        <br />
                        {relData.res.Language_Spoken_at_Home__c}
                      </>
                    )}
                  </Grid>
                </>
              );
            })}
            {relationshipAcc && (
              <>
                <Grid item xs={12} sm={10} />
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AiOutlinePlus />}
                    onClick={e => addRelationship(e)}
                    // disabled={relationshipBtn}
                  >
                    Add Relationship
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default PersonalDetails;
