/* eslint-disable */

import axios from "axios";
import Config from "./Config";
import Headers from "./Headers";

const loginUrl = `${Config.server}/login`;
const refreshUrl = `${Config.server}/refresh`;

const LoginApi = {

  login: async (user, pwd) => {
    const resp = await axios.post(loginUrl,
      {
        "user": user,
        "pwd": pwd,
      },
      { headers: Headers.jsonHeaders, }
    );
    return resp.data;
  },

  refresh: async (accessToken, user, refreshToken) => {
    const resp = await axios.post(refreshUrl,
      {
        user: user,
        token: refreshToken,
      },
      { headers: Headers.authTokenWithJson(accessToken), }
    );
    return resp.data
  },

}

export default LoginApi;
