/* eslint-disable */
import {
  CButton, CCol,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow
} from "@coreui/react";
import React, { useContext, useState } from "react";
import { ModalAuthContext } from "../../App";
import FilesApi from "../../api/FilesApi";

const UploadFileModal = (props) => {
  const ctx = useContext(ModalAuthContext);
  const [curKey, setCurKey] = useState("");
  const [curValue, setCurValue] = useState("");
  const [metaArr, setMetaArr] = useState([]);
  const [curFile, setCurFile] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const clear = () => {
    setCurKey("");
    setCurValue("");
    setMetaArr([]);
    setCurFile(null);
    setIsLoading(false);
  };

  const upload = async () => {
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
      setIsLoading(true)
      const filePath = `${props.curDir}${curFile.name}`;
      // console.log(`filePath: ${filePath}`);
      const resp = await FilesApi.upload(ctx.accessToken, formData, filePath);
      props.handleUploadCompleted(resp);
      clear();
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

        <CFormInput style={{ marginTop: 15, marginBottom: 20 }} type={"file"}  onChange={e => setCurFile(e.target.files[0])} />

        <CButton color={"info"} onClick={() => upload()} disabled={isLoading}>
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
