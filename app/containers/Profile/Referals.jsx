import React from 'react';
import { BsFacebook, BsLinkedin } from 'react-icons/bs';
import {useTheme,makeStyles} from '@material-ui/core';
import { BiUserCircle, BiMobile } from 'react-icons/bi';
import { GoLocation } from 'react-icons/go';
import './profile.scss'
const Referals = () => {
  return (
    <div>
      <div
        style={{
          borderBottom: '1px solid #D2E1E9',
        }}
        className='respreferral'
      >
        <div style={{ diplay: 'flex', flexDirection: 'row' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left',
              width: '77%',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontWeight: 500,
                fontSize: '16px',
                marginBottom: '1rem',
              }}
            >
              Share your referral link with great people or upcoming students
              who would benefit from joining your college.
            </div>
            <div
              style={{
                display: 'flex',
                fontWeight: 600,
                fontSize: '16px',
                marginBottom: '1rem',
              }}
            >
              What happens after you share the link?
            </div>
            <div
              style={{
                display: 'flex',
                fontWeight: 400,
                fontSize: '14px',
                marginBottom: '1rem',
              }}
            >
              Anyone who gets the link will be able to add their details on
              their own and submit relevant details your college would require
              to make a referral successful.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontWeight: 600,
              fontSize: '11px',
              marginBottom: '1rem',
            }}
          >
            Your Referral Link
          </div>
          <div>
            <div
              style={{
                border: '1px solid #E4E4E4',
                borderRadius: '8px',
                padding: '5px 10px 5px 14px',
              }}
              className='remsResp1'
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontWeight: 500, fontSize: '14px' }}>
                  https://ken42.edu/r/MeghaSubra…
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '12px',
                    border: '1px solid #E4E4E4',
                    borderRadius: '4px',
                    padding: '0px 2px 0px 2px',
                  }}
                >
                  COPY
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontWeight: 600,
              fontSize: '11px',
              marginTop: '1rem',
              marginBottom: '1rem',
            }}
          >
            SHARE ON SOCIAL MEDIA
          </div>
          <div style={{ display: 'flex' }}>
            <div>
              <BsFacebook style={{ fontSize: 25 }}/>
            </div>
            <div style={{ marginLeft: '3px' }}>
              <BsLinkedin style={{ fontSize: 25 }}/>
            </div>
            <div style={{ marginLeft: '3px' }}>
              <BsLinkedin style={{ fontSize: 25 }}/>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          fontWeight: 600,
          fontSize: '16px',
          marginTop: '1rem',
          marginBottom: '0.5rem',
        }}
      >
        People you referred
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {[1, 2, 3, 4].map((item, index) => {
          return (
            <div
              style={{
                display: 'flex',
                backgroundColor: '#F7F7F8',
                borderRadius: '12px',
                width: '14rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontWeight: 600,
                    fontSize: '18px',
                    marginBottom: '0.5rem',
                  }}
                >
                  Mika Singh
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <GoLocation style={{ fontSize: 22 }} />
                  </div>
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: '12px',
                      marginLeft: '0.25rem',
                    }}
                  >
                    Mumbai, India
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <BiUserCircle style={{ fontSize: 22 }} />
                  </div>
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: '12px',
                      marginLeft: '0.25rem',
                    }}
                  >
                    subha1234@gmail.com
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <BiMobile style={{ fontSize: 22 }} />
                  </div>
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: '12px',
                      marginLeft: '0.25rem',
                    }}
                  >
                    +91 8790 542 334
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontWeight: 600,
                    fontSize: '11px',
                    marginTop: '1rem',
                  }}
                >
                  Referred on 12 Aug, 2022
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Referals;
