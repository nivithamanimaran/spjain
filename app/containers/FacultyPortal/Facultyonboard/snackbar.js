import React from 'react'
import { Box, Button, Typography } from '@material-ui/core';
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { TiTick } from "react-icons/ti"
import { BiErrorCircle } from 'react-icons/bi';

export default function Toaster(props) {
    const { severity, display, message, close } = props
    return < Box display={display ? 'block' : 'none'} sx={{ transitionDuration: '0.8s' }}>
        <Box
            style={{
                background: severity === 'error' ? '#d32f2f' : severity === 'loading' ? '#42a5f5' : '#37B24D',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 99999999999999,
                display: 'flex',
                width: '100%',
                height: '60px',
                position: 'fixed',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
            <Box style={{ display: 'flex', marginLeft: '10px', alignItems: 'center', gap: '10px' }}>
                {severity === 'error' ? <BiErrorCircle color='#fff' size={25} /> : severity === 'loading' ? <AiOutlineLoading3Quarters color='#fff' size={25} /> : <TiTick color='#fff' size={25} />}
                <Typography style={{ fontSize: '14px', color: '#fff' }}>{message}</Typography>
            </Box>
            <Button
                variant='contained'
                size='small'
                style={{
                    marginRight: '20px',
                    background: severity === 'error' ? '#f44336' : severity === 'loading' ? '#90caf9' : '#0D9626',
                    boxShadow: 'none',
                    '&:hover': {
                        background: severity === 'error' ? '#f44336' : severity === 'loading' ? '#90caf9' : '#0D9626',
                        boxShadow: 'none',
                    },
                    color: "#ffffff",
                    fontWeight: "bold"
                }}
                onClick={() => {
                    close && close();
                }}>
                close
            </Button>
        </Box>
    </Box >
}