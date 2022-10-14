/* eslint-disable */

import Config from "./Config";
import axios from "axios";
import Headers from "./Headers";

const fsUrl = `${Config.server}/fs/`;
const uploadUrlPrefix = `${Config.server}/fs`;
const uploadDirUrlPrefix = `${Config.server}/fs-delete-dir`;
const copyFileUrlPrefix = `${Config.server}/fs-copy-file/`;
const copyDirUrlPrefix = `${Config.server}/fs-copy-dir/`;

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

  deleteFile: async (token, filePath) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: "Bearer " + token,
      },
    };
    const resp = await axios.delete(`${uploadUrlPrefix}${filePath}`, config);
    return resp.data;
  },

  deleteDir: async (token, dirPath) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: "Bearer " + token,
      },
    };
    const resp = await axios.delete(`${uploadDirUrlPrefix}${dirPath}`, config);
    return resp.data;
  },

  copyFile: async (token, formData) => {
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: "Bearer " + token,
      },
    };
    const resp = await axios.post(`${copyFileUrlPrefix}`, formData, config);
    return resp.data;
  },

  copyDir: async (token, formData) => {
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: "Bearer " + token,
      },
    };
    const resp = await axios.post(`${copyDirUrlPrefix}`, formData, config);
    return resp.data;
  },
};

export default FilesApi;
