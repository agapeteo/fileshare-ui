/* eslint-disable */

const Headers = {
  authJsonHeaders: (token) => {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    }
  },

  jsonHeaders: {
    "Content-Type": "application/json",
  },

}

export default Headers;
