/* eslint-disable */
import {useState} from "react";

export const useModalAuth = (loginFn, refreshTokenInterval, refreshTokenFn) => {
  const [modalComponent, setModalComponent] = useState();
  const [curUser, setCurUser] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [signOutFn, setSignOutFn] = useState(() => {});


  return {
    modalComponent: modalComponent,
    setModalComponent: setModalComponent,

    curUser: curUser,
    setCurUser: setCurUser,

    accessToken: accessToken,
    setAccessToken: setAccessToken,

    loginFn: loginFn,

    refreshTokenFn: refreshTokenFn,

    signOutFn: signOutFn,
    setSignOutFn: setSignOutFn,

    refreshTokenInterval: refreshTokenInterval,
  }
}


export const initModalAuthState = {
  modalComponent: null,
  setModalComponent: null,

  curUser: null,
  setCurUser: null,

  accessToken: null,
  setAccessToken: null,

  loginFn: null,

  refreshTokenFn: null,

  signOutFn: () => { console.log(`init sign out`)},
  setSignOutFn: null,

  refreshTokenInterval: 0,
}
