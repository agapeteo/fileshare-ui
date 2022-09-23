/* eslint-disable */

const Headers = {

  authToken: (token) => {
    return {
      Authorization: "Bearer " + token
    }
  },

  authTokenWithJson: (token) => {
    return {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    }
  },

  jsonHeaders: {
    "Content-Type": "application/json",
  },

}

export default Headers;
