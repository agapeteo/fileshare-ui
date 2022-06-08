/* eslint-disable */
import {useState} from "react";

export const useModalAuth = (loginFn, refreshTokenInterval, refreshTokenFn) => {
  const [modalComponent, setModalComponent] = useState();
  const [curUser, setCurUser] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [signOutFn, setSignOutFn] = useState();


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

export const useTestAuth = (handlerFunc) => {
  const [testMsg, setTestMsg] = useState("test next level 2");

  return {
    testMsg: testMsg,
    setTestMsg: setTestMsg,
    handlerFunc: handlerFunc
  }
}


export const initModalAuthState = {
  modalComponent: null,
  setModalComponent: null,

  curUser: '',
  setCurUser: () => () => {
  },

  accessToken: null,
  setAccessToken: null,

  refreshToken: null,
  setRefreshToken: null,

  loginFn: () => null,
  refreshTokenFn: null,

  refreshTokenInterval: 0,

  testMsg: "some test message"
}
