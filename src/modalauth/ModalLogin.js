/* eslint-disable */

// import Modal from "./Modal";
import { useContext, useEffect, useState, useRef } from "react";
import { CModal } from "@coreui/react";

const STORE_USER_KEY = "auth.user";
const STORE_ACCESS_TOKEN_KEY = "auth.access.token";
const STORE_REFRESH_TOKEN_KEY = "auth.refresh.token";

const ModalLogin = ({ authContext }) => {
  const ctx = useContext(authContext);

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [loginError, setLoginErr] = useState();

  const inputRef = useRef(null);

  let timer = null;

  const handleLogin = async (e) => {
    e.preventDefault();

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
          clearInterval(timer);
        }
        timer = setInterval(startRefreshToken, 1000 * ctx.refreshTokenInterval);
      }
    } catch (e) {
      console.log(`login error: ${JSON.stringify(e)}`);
      setLoginErr("error logging in. please try again");
      signOut();
    }
  };

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
  };

  const startRefreshToken = async () => {
    console.log(`start refresh token`);

    const storedUser = sessionStorage.getItem(STORE_USER_KEY);
    // console.log(`stored user: ${storedUser}`)
    const refreshToken = sessionStorage.getItem(STORE_REFRESH_TOKEN_KEY);
    // console.log(`refresh token: ${refreshToken}`)
    const accessToken = sessionStorage.getItem(STORE_ACCESS_TOKEN_KEY);
    // console.log(`access token: ${accessToken}`)
    if (!refreshToken) {
      console.log("no refresh token. skipping");
      if (timer) {
        clearInterval(timer);
      }
      return;
    }
    try {
      let response = await ctx.refreshTokenFn(accessToken, storedUser, refreshToken);
      // console.log(`refresh response: ${JSON.stringify(response)}`)
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
  };

  useEffect(() => {
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
        console.log(`refresh interval: ${JSON.stringify(ctx.refreshTokenInterval)}`);
        setTimeout(startRefreshToken, 0);
        timer = setInterval(startRefreshToken, 1000 * ctx.refreshTokenInterval);
      }
    };

    init();

    return () => {
      if (timer) {
        clearInterval(timer);
      }
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    };
  }, []);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [ctx.curUser]);

  return (
    <CModal visible={ctx && ctx.curUser && ctx.accessToken ? false : true}>
      {/*<Modal visible={ctx && ctx.curUser && ctx.accessToken ? false : true}>*/}
      <form onSubmit={(e) => handleLogin(e)} style={{ marginLeft: 65, marginTop: 10 }}>

        <input ref={inputRef} placeholder={"user"} type="text" name="uname" required value={user}
               onChange={e => setUser(e.target.value)} style={{ margin: 5 }} />

        <input placeholder={"password"} type="password" name="pass" required value={pwd}
               onChange={e => setPwd(e.target.value)} style={{ margin: 5 }} />

        <p style={{ color: "red" }}>{loginError}</p>
        <div className="button-container">
          <input type="submit" style={{ margin: 5, marginTop: 0 }} />
        </div>
      </form>
    </CModal>
  );
};
export default ModalLogin;
