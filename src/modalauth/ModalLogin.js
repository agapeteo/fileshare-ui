/* eslint-disable */

import {CButton, CFormInput, CModal, CModalBody} from "@coreui/react";
import {useContext, useEffect, useState} from "react";

const STORE_USER_KEY = "auth.user";
const STORE_ACCESS_TOKEN_KEY = "auth.access.token";
const STORE_REFRESH_TOKEN_KEY = "auth.refresh.token";

const ModalLogin = ({authContext}) => {
  const ctx = useContext(authContext);

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [loginError, setLoginErr] = useState();

  let timer = null;

  const handleLogin = async () => {
    console.log(`login fn`);

    setLoginErr("");

    try {
      let response = await ctx.loginFn(user, pwd);

      setUser("");
      setPwd("");

      sessionStorage.setItem(STORE_USER_KEY, user);
      sessionStorage.setItem(STORE_ACCESS_TOKEN_KEY, response.access);
      sessionStorage.setItem(STORE_REFRESH_TOKEN_KEY, response.refresh);

      ctx.setCurUser(user);
      ctx.setAccessToken(response.access);

      if (ctx.refreshTokenInterval != 0) {
        if (timer) {
          clearInterval(timer)
        }
        timer = setInterval(startRefreshToken, 1000 * ctx.refreshTokenInterval)
      }
    } catch (e) {
      console.log(`login error: ${JSON.stringify(e)}`)
      setLoginErr("error logging in. please try again");
      signOut();
    }
  }

  const signOut = () => {
    console.log(`signed out...`);

    sessionStorage.removeItem(STORE_USER_KEY);
    sessionStorage.removeItem(STORE_ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(STORE_REFRESH_TOKEN_KEY);

    if (timer) {
      clearInterval(timer);
    }

    setUser("");
    setPwd("");

    ctx.setCurUser(null);
    ctx.setAccessToken(null);
  }

  const startRefreshToken = async () => {
    const storedUser = sessionStorage.getItem(STORE_USER_KEY);
    const refreshToken = sessionStorage.getItem(STORE_REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      console.log("no refresh token. skipping");
      if (timer) {
        clearInterval(timer);
      }
      return;
    }
    try {
      let response = await ctx.refreshTokenFn(storedUser, refreshToken);
      if (!response || !response.access) {
        signOut();
        return;
      }
      sessionStorage.setItem(STORE_ACCESS_TOKEN_KEY, response.access);
      ctx.setAccessToken(response.access);
    } catch (e) {
      console.log(`failed to refresh token. error: ${JSON.stringify(e)}`);
      signOut();
    }
  }

  useEffect( () => {
    const init = async () => {
      console.log(`initializing ModalLogin`);

      ctx.setSignOutFn(() => signOut);

      const curUser = sessionStorage.getItem(STORE_USER_KEY);
      const accessToken = sessionStorage.getItem(STORE_ACCESS_TOKEN_KEY);

      if (curUser) {
        ctx.setCurUser(curUser);
        ctx.setAccessToken(accessToken);
      }

      if (ctx && ctx.refreshTokenInterval && ctx.refreshTokenInterval != 0) {
        console.log(`refresh interval: ${JSON.stringify(ctx.refreshTokenInterval)}`)
        setTimeout(startRefreshToken, 0);
        timer = setInterval(startRefreshToken, 1000 * ctx.refreshTokenInterval)
      }
    }

    init();

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    };
  }, [])

  return (
    <CModal visible={ctx && ctx.curUser && ctx.accessToken ? false : true}>
      <CModalBody>

        <CFormInput placeholder={"user"} value={user} onChange={e => setUser(e.target.value)}/>
        <CFormInput type="password" inputMode={"password"} placeholder={"pwd"} value={pwd}

                    onChange={e => setPwd(e.target.value)}/>

        <p style={{color: "red"}}>{loginError}</p>

        <CButton color={"success"} onClick={() => handleLogin()}>Login</CButton>

      </CModalBody>
    </CModal>
  )
}
export default ModalLogin;
