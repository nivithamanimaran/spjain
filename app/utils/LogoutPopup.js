import React from 'react';
// import AlertDialog from '../../components/KenDialogBox';
import AlertDialog from '../components/KenDialogBox';
import history from './history';

function LogoutPopup(history) {
    console.log("historyyyy", history);
    return (
        <div>
            <AlertDialog
                title="SESSION EXPIRED"
                children="Session Expired Please Login Again"
                open="true"
                handleClose={() => history.push('/')}
                dialogActionFlag="true"
                positiveButtonText="LOGIN"
            />
        </div>
    )
}

export default LogoutPopup;