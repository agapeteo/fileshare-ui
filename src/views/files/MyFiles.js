/* eslint-disable */
import React, {useState, useEffect, useContext} from "react";
import CIcon from '@coreui/icons-react';
import {cilFolder, cilFile} from '@coreui/icons';

import {CButton} from "@coreui/react";
import {ModalAuthContext} from "../../App";
import FilesApi from "../../api/FilesApi";
import Config from "../../api/Config";
import UploadFileModal from "./UploadFileModal";

const MyFiles = () => {
  const ctx = useContext(ModalAuthContext);
  const [fs, setFs] = useState({});
  const [curDir, setCurDir] = useState('/');
  const [sourceDir, setSourceDir] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleUploadObjectModal, setVisibleUploadObjectModal] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [selectedDir, setSelectedDir] = useState(new Set());
  const [copiedFile, setCopiedFile] = useState(new Set());
  const [copiedDir, setCopiedDir] = useState(new Set());
  const [highlightedFile, setHighlightedFile] = useState("");
  const [highlightedDir, setHighlightedDir] = useState("");

  const copySelected = async () => {
    const copiedFile = new Set([...selected.values()]);
    const copiedDir = new Set([...selectedDir.values()]);
    setSourceDir(curDir);
    setCopiedFile(copiedFile);
    setCopiedDir(copiedDir);
  }

  const pasteSelected = async () => {
    const copiedFiles = copiedFile.map(async file => { //todo: resolve promise for spinner
      const data = {from: `${sourceDir}${file}`, to: `${curDir}`}
      const copiedFile = await FilesApi.copyFile(ctx.accessToken, data);

      return copiedFile;
    })

    const copiedDirs = copiedDir.map(async dir => {
      const copiedDirName = dirName(dir);
      const data = {from: `${sourceDir}${copiedDirName}/`, to: `${curDir}`}
      const copiedDir = await FilesApi.copyDir(ctx.accessToken, data);

      return copiedDir;
    })

    const deletedAll = [...copiedFiles, ...copiedDirs];
    await Promise.all(deletedAll).then(async () => {
      await fetchFs();
      setCopiedFile(new Set());
      setCopiedDir(new Set());
      setSelected(new Set());
      setSelectedDir(new Set());
    });
  }

  const deleteSelected = async () => {
    const itemsCount = selected.size + selectedDir.size;
    const selectedDirPath = selectedDir.size > 0 ? selectedDir.values().next().value : "";
    const selectedFileName = selected.size > 0 ? selected.values().next().value : "";
    const confirmationText = itemsCount > 1 ? `delete ${itemsCount} items?` : `delete ${selected.size > 0 ? selectedFileName : dirName(selectedDirPath)}?`;

    if (!window.confirm(confirmationText)) {
      return
    }

    const deletedFiles = selected.map(async file => { //todo: resolve promise for spinner
      const filePath = `${curDir}${file}`;
      const deletedFile = await FilesApi.deleteFile(ctx.accessToken, filePath);

      return deletedFile;
    })

    const deletedDirs = selectedDir.map(async dir => {
      const deletedDir = await FilesApi.deleteDir(ctx.accessToken, dir);
      return deletedDir;
    })

    const deletedAll = [...deletedFiles, ...deletedDirs];
    await Promise.all(deletedAll).then(async () => {
      setSelected(new Set());
      setSelectedDir(new Set());
      await fetchFs();
    });
  }

  const selectDir = (name, isMultiSelect) => {
    const newSelected = isMultiSelect ? new Set(selectedDir) : new Set();
    const newSelectedFiles = isMultiSelect ? new Set(selected) : new Set();

    if (newSelected.has(name)) {
      newSelected.delete(name);
    } else {
      newSelected.add(name);
    }

    setSelectedDir(newSelected);
    setSelected(newSelectedFiles);
  }

  const selectFile = (name, isMultiSelect) => {
    const newSelected = isMultiSelect ? new Set(selected) : new Set();
    const newSelectedDirs = isMultiSelect ? new Set(selectedDir) : new Set();

    if (newSelected.has(name)) {
      newSelected.delete(name);
    } else {
      newSelected.add(name);
    }

    setSelected(newSelected);
    setSelectedDir(newSelectedDirs);
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
    // console.log('results', results.length);
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
                  onClick={() => setCurDir(pathObj.path)}
          >
            <h5> {pathObj.name} </h5>
          </button>
        ))}

        <a style={{marginLeft: 20, margin: 10}}
           href={`${Config.server}${curDir}${selected.values().next().value}`}
           target={"_blank"}
        >
          <CButton color={"light"} disabled={selected.size !== 1}>Download</CButton>
        </a>
        <CButton
          color={"danger"}
          variant={"outline"}
          style={{marginLeft: 20, margin: 10}}
          disabled={selected.size === 0 && selectedDir.size === 0}
          onClick={() => deleteSelected()}
        >
          Delete
        </CButton>
        <CButton
          color={"danger"}
          variant={"outline"}
          style={{marginLeft: 20, margin: 10}}
          disabled={selected.size + selectedDir.size === 0}
          onClick={() => copySelected()}
        >
          Copy
        </CButton>
        <CButton
          color={"danger"}
          variant={"outline"}
          style={{marginLeft: 20, margin: 10}}
          disabled={copiedFile.size + copiedDir.size === 0 || sourceDir === curDir}
          onClick={() => pasteSelected()}
        >
          Paste
        </CButton>
      </div>

      <div style={{position: "fixed", top: 20, right: 20}}>
        <CButton color={"light"} onClick={() => setVisibleUploadObjectModal(true)}>Upload</CButton>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 10,
          margin: 10,
          flexWrap: "wrap",
          border: 1,
          borderRadius: 10,
          borderStyle: "inset",
          backgroundColor: "#f5fffa",
        }}
      >

        {isLoading ?
          <h2> Loading </h2>
          : null
        }
        {fs[curDir] ? fs[curDir].dirs.map((dir, idx) => {
          const decodeDirName = decodeURI(dir);

          return (
            <div key={idx}
                 style={{
                   position: "relative",
                   margin: 5, textAlign: "center", width: 155,
                   backgroundColor: selectedDir.has(decodeDirName) ? "powderblue" : highlightedDir === decodeDirName ? "linen" : "",
                 }}
                 onDoubleClick={() => {
                   setCurDir(decodeDirName);
                 }}
                 onClick={e => {
                   selectDir(decodeDirName, e.metaKey)
                 }}
                 onMouseOver={e => {
                   if (!selectedDir.has(decodeDirName)) {
                     setHighlightedDir(decodeDirName);
                   }
                 }}
                 onMouseOut={e => {
                   if (!selectedDir.has(decodeDirName)) {
                     setHighlightedDir("");
                   }
                 }}
            >
              <CIcon icon={cilFolder} size={"3xl"} style={{color: "darkslateblue"}}/>
              <p>{dirName(decodeDirName)}</p>
            </div>

          )
        }) : ""}

        {fs[curDir] ? fs[curDir].files.map((file, idx) => {
          const fileNameDecoded = decodeURI(file.name);

          return (
            <div
              key={idx}
              style={{
                position: "relative",
                margin: 10, textAlign: "center", width: 155,
                backgroundColor: selected.has(fileNameDecoded) ? "powderblue" : highlightedFile === fileNameDecoded ? "linen" : "",
              }}
              onClick={e => selectFile(fileNameDecoded, e.metaKey)}
              onMouseOver={e => {
                if (!selected.has(fileNameDecoded)) {
                  setHighlightedFile(fileNameDecoded);
                }
              }}
              onMouseOut={e => {
                if (!selected.has(fileNameDecoded)) {
                  setHighlightedFile("");
                }
              }}
            >
              <CIcon icon={cilFile} size={"3xl"} style={{color: "darkolivegreen"}}/>
              <p>{decodedAndStripped(file.name)}</p>
            </div>
          )
        }) : ""}
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
