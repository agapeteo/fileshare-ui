/* eslint-disable */

import Config from "./Config";
import axios from "axios";
import Headers from "./Headers";

const fsUrl = `${Config.server}/fs/`;
const uploadUrlPrefix = `${Config.server}/fs`;

const FilesApi = {
  fsFiles: async (token) => {
    const resp = await axios.get(fsUrl, { headers: Headers.authTokenWithJson(token) });
    return resp.data;
  },

  upload: async (token, formData, filePath) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: "Bearer " + token,
      },
    };
    const resp = await axios.post(`${uploadUrlPrefix}${filePath}`, formData, config);
    return resp.data;
  },


};

export default FilesApi;
