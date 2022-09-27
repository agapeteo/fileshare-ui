/* eslint-disable */
import {useState, useEffect, useContext} from "react";
import CIcon from '@coreui/icons-react';
import {cilFolder, cilFile} from '@coreui/icons';

import {
  CButton,
} from "@coreui/react";
import {ModalAuthContext} from "../../App";
import FilesApi from "../../api/FilesApi";
import Config from "../../api/Config";
import UploadFileModal from "./UploadFileModal";


const MyFiles = () => {
  const ctx = useContext(ModalAuthContext);
  const [fs, setFs] = useState({});
  const [curDir, setCurDir] = useState('/');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleUploadObjectModal, setVisibleUploadObjectModal] = useState(false);
  const [selected, setSelected] = useState([]);

  const deleteDir = async () => {
    if(!window.confirm(`delete folder ${curDir}?`)) { return }
    await FilesApi.deleteDir(ctx.accessToken, curDir);
    setCurDir(toParent(curDir));
    await fetchFs();
    setSelected([]);
  }
  const deleteFile = async () => {
    if(!window.confirm(`delete file ${selected[0]}?`)) { return }
    const filePath = `${curDir}${selected[0]}`;
    await FilesApi.deleteFile(ctx.accessToken, filePath);
    await fetchFs();
    setSelected([]);
  }
  const select = name => {
    const newSelected = [];
    newSelected.push(name);
    setSelected(newSelected);
  }

  const convertResp = (fs, dirJson) => {
    // console.log(`dir: ${JSON.stringify(dirJson.info.name)}`);

    const dirs = [];
    for (const dir of dirJson.dirs) {
      dirs.push(dir.info.name);
      convertResp(fs, dir);
    }
    dirs.sort((a, b) => sortByName(a, b));

    const files = dirJson.files;
    files.sort((a, b) => sortByName(a, b));

    fs[dirJson.info.name] = {info: dirJson.info, files: files, dirs: dirs};
  }

  const fetchFs = async () => {
    if (!ctx.accessToken) {
      setFs({});
      return;
    }
    try {
      setIsLoading(true);
      const dirResp = await FilesApi.fsFiles(ctx.accessToken);
      // console.log(`resp: ${JSON.stringify(dirResp)}`);
      const newFs = {};
      if (dirResp) {
        convertResp(newFs, dirResp.Dir);
        setFs(newFs);
      }
      setFs(newFs);
      // console.log(JSON.stringify(newFs, null, " "))
    } catch (e) {
      console.log(`cannot fetch files: ${JSON.stringify(e, null, " ")}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSrcUploaded = async (newObjs) => {
    // const id = newObj.id;
    // const fileHash = Object.keys(newObj.files)[0];
    // console.log(`new obj: ${JSON.stringify(newObj)}`);
    // console.log(`id: ${id}`);
    // console.log(`hash: ${fileHash}`);
    const results = await Promise.all(newObjs);
    console.log('results', results);
    await fetchFs();
  };

  useEffect(() => {
    fetchFs();
    document.body.style = 'background: powderblue';
  }, [ctx.accessToken]);

  return (
    <>

      <div style={{display: "flex", flexDirection: "row", marginLeft: 20, margin: 10}}>
        <button style={{margin: 3, borderRadius: 10, backgroundColor: "mintcream", padding: 10}}
                onClick={() => setCurDir('/')}>
          <h5> / </h5>
        </button>
        {pathArr(curDir).map((pathObj, idx) => (
          <button key={idx} style={{margin: 3, borderRadius: 10, backgroundColor: "mintcream", padding: 10}}
                  onClick={() => setCurDir(pathObj.path)}>
            <h5> {pathObj.name} </h5>
          </button>
        ))}
        {
          selected.length > 0
            ? <a style={{marginLeft: 20, margin: 10}}
                 href={`${Config.server}${curDir}${selected[0]}`}
                 target={"_blank"}
            >
              <CButton color={"light"}>Download</CButton>
            </a>
            : ""
        }
        {
          selected.length > 0
            ? <CButton
              color={"danger"}
              onClick={() => deleteFile()}
            >
              Delete
            </CButton>
            : ""
        }
        {
          curDir !== "/"
            ? <CButton
              color={"danger"}
              onClick={() => deleteDir()}
            >
              Delete current folder
            </CButton>
            : ""
        }
      </div>

      <div style={{position: "fixed", top: 20, right: 20}}>
        <CButton color={"light"} onClick={() => setVisibleUploadObjectModal(true)}>Upload</CButton>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "row",
        padding: 10,
        margin: 10,
        flexWrap: "wrap",
        border: 1,
        borderRadius: 10,
        borderStyle: "inset",
        backgroundColor: "mintcream"
      }}>

        {isLoading ?
          <h2> Loading </h2>
          : null
        }
        {fs[curDir] ? fs[curDir].dirs.map((dir, idx) => (
          <div key={idx} style={{margin: 5, textAlign: "center", width: 150}} onClick={() => {
            setCurDir(dir)
          }}>
            <CIcon icon={cilFolder} size={"3xl"} style={{color: "darkslateblue"}}/>
            <p>{dirName(dir)}</p>
          </div>

        )) : ""}

        {fs[curDir] ? fs[curDir].files.map((file, idx) => (
          <div
            key={idx}
            style={{
              margin: 10, textAlign: "center", width: 155,
              backgroundColor: selected[0] && selected[0] === file.name ? "powderblue" : ""
            }}
            onClick={() => select(file.name)}
          >
            <CIcon icon={cilFile} size={"3xl"} style={{color: "darkolivegreen"}}/>
            <p>{decodedAndStripped(file.name)}</p>
          </div>

        )) : ""}
      </div>
      <UploadFileModal
        curDir={curDir}
        visible={visibleUploadObjectModal}
        closeUploadObjectModalFunc={() => setVisibleUploadObjectModal(false)}
        handleUploadCompleted={handleSrcUploaded}
      />
    </>
  )
}

const pathArr = (dir) => {
  const res = [];
  if (dir === '/') {
    return res;
  }
  const parts = dir.split('/');
  let pathStr = "/";
  for (const part of parts) {
    if (part) {
      pathStr = pathStr.concat(`${part}/`)
      res.push({name: part, path: pathStr})
    }
  }
  return res;
}

const toParent = (dir) => {
  if (dir === '/') {
    return dir;
  }
  const curName = dirName(dir);
  const end = dir.length - curName.length - 1;
  const res = dir.slice(0, end);
  return res;
}

const dirName = (path) => {
  const parts = path.split('/');
  return parts[parts.length - 2];
}

const decodedAndStripped = name => {
  const fileName = decodeURI(name);
  if (fileName.length > 21) {
    const res = fileName.slice(0, 18);
    return res + "..";
  }
  return fileName;
}

const sortByName = (a, b) => {
  return (a.name === b.name) ? 0 : ((a.name > b.name) ? 1 : -1)
};

export default MyFiles
