/* eslint-disable */
import {
  CButton,
  CCol,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from "@coreui/react";
import React, {useContext, useEffect, useState} from "react";
import { ModalAuthContext } from "../../App";
import FilesApi from "../../api/FilesApi";
import UploadDropZone from "./UploadDropZone";

const UploadFileModal = (props) => {
  const ctx = useContext(ModalAuthContext);
  const [curKey, setCurKey] = useState("");
  const [curValue, setCurValue] = useState("");
  const [metaArr, setMetaArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, uploadDropZoneFiles] = useState([]);

  const clear = () => {
    setCurKey("");
    setCurValue("");
    setMetaArr([]);
    uploadDropZoneFiles([]);
  };

  const uploadAll = async (files) => {
    // console.log('files', files);
    let results = [];
    try {
      setIsLoading(true);
      // console.log(isLoading);
      results = files.map(async  file => {
        const result = await upload(file);
        return await result;
      });

      Promise.all(results).then(() => setIsLoading(false))

    } catch (e) {
      console.log(e);
    } finally {
      props.handleUploadCompleted(results);
      clear();
    }

    // setIsLoading(false);
  }

  const upload = async (curFile) => {
    const formData = new FormData();
    formData.append("file", curFile);

    formData.append("metadata", "pp-app=filera");

    for (const metadata of metaArr) {
      formData.append("metadata", `${metadata.curKey}=${metadata.curValue}`);
    }

    if (curKey && curValue) {
      formData.append("metadata", `${curKey}=${curValue}`);
    }

    try {
      const localPath = curFile.fullPath ? curFile.fullPath.substr(1) : curFile.name ;
      const filePath = `${props.curDir}${localPath}`;
      const resp = await FilesApi.upload(ctx.accessToken, formData, filePath);

      return resp;
    } catch (err) {
      console.log(`error during upload: ${JSON.stringify(err)}`);
    }
  };

  const deleteMeta = (idx) => {
    const newArr = [...metaArr];
    newArr.splice(idx, 1);
    setMetaArr(newArr);
  };

  const newMeta = () => {
    const newArr = [...metaArr];
    newArr.push({ curKey: curKey, curValue: curValue });
    setCurKey("");
    setCurValue("");
    setMetaArr(newArr);
  };

  return (
    <CModal size={"lg"} visible={props.visible} onClose={props.closeUploadObjectModalFunc}>
      <CModalHeader>
        <CModalTitle>
          <strong>Create new file object</strong>
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTable striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">key</CTableHeaderCell>
              <CTableHeaderCell scope="col">value</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {metaArr.map((meta, idx) => (
              <CTableRow key={idx}>
                <CTableDataCell>{meta.curKey}</CTableDataCell>
                <CTableDataCell>{meta.curValue}</CTableDataCell>
                <CTableDataCell><CButton size={"sm"} color={"danger"} onClick={() => deleteMeta(idx)}>delete</CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <CRow>
          <CCol><CFormInput value={curKey} onChange={e => setCurKey(e.target.value)} /> </CCol>
          <CCol><CFormInput value={curValue} onChange={e => setCurValue(e.target.value)} /> </CCol>
          <CCol> <CButton onClick={() => newMeta()}>Add</CButton> </CCol>
        </CRow>

        <CFormInput style={{ marginTop: 15, marginBottom: 20 }} type={"file"} onChange={e => uploadDropZoneFiles([e.target.files[0]])} />

        <UploadDropZone uploadDropZoneFiles={uploadDropZoneFiles}/>

        <CButton color={"info"} onClick={() => uploadAll(files)} disabled={isLoading}>
          {isLoading ?
            <>
              <CSpinner color={"warning"} />
            </>
            : ""}
          Upload
        </CButton>
      </CModalBody>
    </CModal>
  );
};

export default UploadFileModal;
