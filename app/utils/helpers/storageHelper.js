import {
  KEY_PARENT_DETAILS,
  KEY_USER_DETAILS,
  KEY_USER_CHANGE_LANG,
  KEY_FIRE_REG_TOKEN,
  KEY_USER_TYPE,
  KEY_LOGIN_ACCESS_TOKEN,
  KEY_REFRESH_TOKEN
} from '../constants';
import { unsubscribeMessage } from '../MessageHelper';
import { useHistory } from 'react-router-dom';
export const getUserDetails = () => {
  const user = localStorage.getItem(KEY_USER_DETAILS);
  return user ? JSON.parse(user) : null;
};

export const getParentDetails = () => {
  const user = localStorage.getItem(KEY_PARENT_DETAILS);
  return user ? JSON.parse(user) : null;
};

export const getUserChangeLang = () => {
  const flag = localStorage.getItem(KEY_USER_CHANGE_LANG);
  return flag ? JSON.parse(flag) : null;
};

export const logOut = (config, history) => {
  // unsubscribeMessage(
  //   config,
  //   getUserDetails,
  //   getParentDetails,
  //   localStorage.getItem(KEY_FIRE_REG_TOKEN)
  // );
  localStorage.clear()
  history.push('/');
};

// const handleClose = () =>{history.push('/')}


