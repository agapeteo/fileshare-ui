/* eslint-disable */

import axios from "axios";
import Config from "./Config";
import Headers from "./Headers";

const loginUrl = `${Config.server}/login`;
const refreshUrl = `${Config.server}/refresh`;

let counter = 0;


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

  // fakeLogin: async (user, pwd) => {
  //   console.log('fake login');
  //   if (user === "alex"  && pwd === "xela") {
  //     return {
  //       accessToken: "some access token -",
  //       refreshToken: "some refresh token -"
  //     }
  //   }
  //   return null;
  // },

  // fakeRefreshToken: async (token) => {
  //   console.log(`calling fake access token: ${token} counter: ${counter}`);
  //   if (counter <= 2) {
  //     counter++;
  //     return "access token " + counter;
  //   }
  //   counter = 0;
  //   return null;
  // },


  refresh: async (user, refreshToken) => {
    const resp = await axios.post(refreshUrl,
      {
        user: user,
        token: refreshToken,
      },
      { headers: Headers.jsonHeaders, }
    );
    return resp.data
  },


}

export default LoginApi;
