import { Typography, Grid, Card, Button, TextField, Paper, InputBase } from "@material-ui/core";

import React, { useState } from 'react';
import {makeStyles, useTheme } from '@material-ui/core/styles';
import Union1 from '../../assets/Union1.png';
import moment from "moment";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
// import KenButton from "../../Components/KenButton";
import "./Support.css"
import InputAdornment from '@material-ui/core/InputAdornment';
import DocumentRequest from "./DocumentRequest";
import KenButton from "../../global_components/KenButton";
import {
  createCase,
  getCase,
  getFaqList,
  postFaq,
  DeleteCase,
  getCaseHistory,
  getFacultyDetails,
  getSignature,
} from '../../utils/ApiService';
import { useHistory } from "react-router-dom";
import Divider from '@material-ui/core/Divider';
import KenSelect from "../../components/KenSelect";
import Tasks from "../Student Service/Filterdata";
import { Search } from "@material-ui/icons";
// import AddYourRequest from "../Student Service/AddYourRequest"
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {
  getParentDetails,
  getUserDetails,
} from '../../utils/helpers/storageHelper';
import KenLoader from "../../components/KenLoader";

const Support = () => {
  // const navigate = useNavigate();
  const history = useHistory();
  const handlenav = () => {
    history.push("/AddRequest")
  }
  const grievance = () => {
    history.push("/Greivance")
  }

  const seedetails = (value) => {
    let id=value?.id
      history.push(`/SupportDetails?recordID=${id}`)
  }
  // const filterdata=()=>{
  //   history.push("/FilterData")
  // }
  const [caseHistory, setCaseHistory] = useState([]);
  const [serviceCase, setServiceCase] = useState([]);
  const [caseContent, setCaseContent] = useState();
  const [classContent, setClassContent] = useState([])
  const [searchQuery, setSearchQuery] = useState("");
  const [loader,setLoader]= useState(false);
  const [open,setOpen]=useState('');
    const [topic,setTopic]=useState('');
    const [trigger,setTrigger]=useState(false);
  const [faqData, setFaqData] = useState([]);
  const [faqTopic, setFaqTopic] = useState('');
  const [faqQust, setFaqQust] = useState('');
  const [faqFilter, setfaqFilter] = useState('');

  const profile = getUserDetails().ContactId;


  const handleCreateCase = () => {
    try {
      createCase().then(res => {
        console.log(res);
        setCaseContent(res)
      }).catch(err => {
        return err
      })
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    //Case
    if(profile){
      setLoader(true)
      getCase(profile,open,topic).then(res => {
        console.log(res);
        setServiceCase(res)
        setLoader(false)
      }).catch(err => {
        console.log(err);
        setLoader(false)
      })
    }
   
  }, [trigger])
    //Case
    const handleCancelCase=(value)=>{
      let recordId=value;
        setLoader(true)
        DeleteCase(recordId).then(res => {
          console.log(res);
          setTrigger(!trigger)
          setLoader(false)
        }).catch(err => {
          console.log(err);
          setLoader(false)
        })
    }
    
   
  React.useEffect(() => {
    //Case
    if(profile){
      setLoader(true)
      getFaqList(profile,faqFilter).then(res => {
        console.log(res);
        setFaqData(res)
        setLoader(false)
      }).catch(err => {
        console.log(err);
        setLoader(false)
      })
    }
   
  }, [faqFilter])

  const handleCreateFaq=()=>{
    let payload=[
      {
      question:faqQust,
      topic:faqTopic
      }
      ];
    if(payload[0].question&&payload[0].topic ){
      postFaq(payload).then((res)=>{
        console.log(res);
        setFaqQust('');
        setFaqTopic('')
      })
      .catch((err)=>{
        console.log(err);
      })
    }

  }

  const useStyles = makeStyles(theme => ({
  
  }))

  console.log(caseHistory);
  console.log(classContent);
  const allPrograms = [
    { label: "Document type", value: "Document type" },
    { label: "Fundraising", value: "Fundraising" },
    { label: "Programe", value: "Programe" }
  ]
  const filter = [
    {
      label: "Open & Closed", value: "Open & Closed"
    },
    {
      label: "All Documents", value: "All Documents"
    },
    {
      label: "All Topics", value: "All Topics"
    }
  ]
  const handleSeedetails = (id) => {

    // navigate(`/Support/${id}`)
  }
  const [showTask, setshowTask] = useState(false);
  const classes = useStyles();

  return (
    <>
    {loader&&<KenLoader/>}
      {
        showTask && (
          <Tasks
            showTask={showTask}
            onCancel={() => {
              setshowTask(false);
            }} 
            setOpenData={setOpen}
            setTopicData={setTopic}
            setTrigger={setTrigger}
            trigger={trigger}
            />
        )
      }
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >


        <Grid item md={4}>
          <Card className="support-request-div">
            <div className="support-icon-name">
              <div className="icon-support-name">
                <img src={Union1} width={"35.5px"} height={"30.67px"} /></div>
              <div className="support-requestName">Request</div>
            </div>
            <div className="support-request-description">
              <b>Request for transcripts or provisional certificates or any feature requests you might have from your college.</b>

            </div>
            <div className="support-request-btn">
              <KenButton
                variant="contained"
                onClick={handlenav}
                style={{ textTransform: 'capitalize' }}
              >Add your Request</KenButton>
            </div>

          </Card>
        </Grid>
        <Grid item md={4}>
          <Card className="support-request-div" >
            <div className="support-icon-name">
              <div className="icon-support-name">
                <img src={Union1} width={"35.5px"} height={"30.67px"} /></div>
              <div className="support-requestName">Raise a Greivance</div>
            </div>
            <div className="support-request-description">
              <b>If you would like to bring awareness to an issue or request the college authoritites to look at it, you can raise a grievance here.</b>
            </div>
            <div className="support-request-btn">
              <KenButton variant="contained" onClick={grievance} style={{ textTransform: 'capitalize' }} >Raise a Complaint</KenButton>
            </div>

          </Card>
        </Grid>
        <Grid item md={4}>
          <Card className="support-request-div" >
            <div className="support-icon-name">
              <div className="icon-support-name">
                <img src={Union1} width={"35.5px"} height={"30.67px"} /></div>
              <div className="support-requestName">FAQs</div>
            </div>
            <div className="support-request-description">
              <b>See the most commonly answered FAQ here to get answers. </b> </div>
            <div className="support-request-faq">
              See FAQs
            </div>

          </Card>
        </Grid>

      </Grid>
      <br />
      <br />
      <br />
      <br />
      <br />
      <Grid container spacing={3}>
        <Grid md={3} justifyContent="flex-start">
          <div className="request-complaint-div">
            <Typography className="request-complaint" style={{ marginTop: '20px' , marginLeft:'10px' }}>Request & Complaint ({serviceCase.length})</Typography>
          </div>
        </Grid>
        <Grid md={3}></Grid>
        <Grid md={3}></Grid>
        <Grid md={3} container justifyContent="flex-end" >
          <Button
            type="button"
            onClick={() => {
              setshowTask(true);
            }}
            style={{ backgroundColor: '#FFFFFF', height: '30px', marginTop: '20px', color:'#193389'}}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1159/1159641.png"
              width={'12px'}
            />
            &nbsp;&nbsp;Filter
          </Button>
        </Grid>

      </Grid>
      <br />
      <br />
      <Grid
        container
        spacing={2}
        direction="row"
      >
        {serviceCase.length>0&&serviceCase?.map((item, index) => {
          return <Grid item md={4}>
            <Card className="event-list-div">
             {item.Reason?( <div className="event-list-title">{item.Reason}</div>)
             :( <div className="event-list-title">-</div>)}
              <div className="event-list-price"> <span className="price-value"> #{item.RequestNumber} </span>|&nbsp;<span className="price-name">{item.RequestType}</span></div>
              <div className="event-list-date">{moment(item.DateOfRequest).format("MMM Do YY")}</div>
              <div className="event-list-btn">
                <div className="event-action-btn">
                  <div className="event-list-seedetail" onClick={()=>seedetails(item)}> See Details</div>
                  <div className="event-list-cancel" onClick={()=>handleCancelCase(item.id)}>Cancel Request</div>
                </div>
                <div className="event-list-open">{item.Status}</div>
              </div>
            </Card>
          </Grid>

        })}
      </Grid>
      <br />
      <div className="request-complaint-div">
        <Typography className="request-complaint">FAQs</Typography>
      </div>
      <div className="select-box-div" style={{ display: 'flex' }}>
        <Grid container spacing={3}>
          <Grid item md={3}>
            <Paper component="form" className='searchicon' style={{ height: '40px' }}>
              <Search style={{ color: '#A8AFBC' }} />
              <InputBase
                placeholder="Search for question or a keyword" />
            </Paper>
          </Grid>
          <Grid item md={3} style={{marginTop:"-6px"}} >
            <KenSelect
              name="program"
              select
              label=""
              onChange={(e)=>setfaqFilter(e.target.value)}
              value={faqFilter}
              options={filter}
              style={{ height: '40px', width: '150px', color: ' #092682' }}
            />
          </Grid>
        </Grid>
      </div>

      <Grid
        spacing={2}
        container
        direction="row"
      >
        <Grid item md={9}>
          <div className="request-document-div">
            <Typography className="request-document">Document Requests ({faqData?faqData.length:0})</Typography>
          </div>
          <Card className="document-request-card"> <DocumentRequest faqData={faqData} /></Card>
          <div className="request-document-div">
            <Typography className="request-document">Fundraising (0)</Typography>
          </div>
          <Card className="document-request-card"> <DocumentRequest /></Card>
        </Grid>

        <Grid item md={3} style={{marginTop:"45px"}}>
          <Card className="choose-topic-card">
            <div className="choose-topic-div">
              <Typography className="choose-topic-title">Haven’t found what you are looking for?</Typography>
              <Typography className="choose-topic">Topic</Typography>
              <KenSelect
                name="program"
                select
                label=""
                onChange={(e)=>setFaqTopic(e.target.value)}
                options={allPrograms}
                value={faqTopic}

              />
            </div>
            <div className="your-question-div">
              <Typography className="your-question-text">YOUR QUESTION</Typography>
              <TextareaAutosize aria-label="minimum height" value={faqQust} onChange={(e)=>setFaqQust(e.target.value)} minRows={20} placeholder="Type Your Question..." style={{ width: '100%', resize: "none", border: 'none', border: '1px solid #E4E4E4', borderRadius: '8px' }} />
              <KenButton variant="contained" onClick={handleCreateFaq} className='submit' style={{marginTop:"25px"}}>Submit</KenButton>
            </div>
          </Card>
        </Grid>
      </Grid>

    </>
  );
}
export default Support 