/* eslint-disable */

import React, {useContext} from 'react'
import {CButton} from "@coreui/react";
import {ModalAuthContext} from "../../App";
import {Link} from "react-router-dom";

const TestComponent = ({text}) => {
  const ctx = useContext(ModalAuthContext);
  return (
    <>
      <h3>text: {text}</h3>
      <CButton onClick={() => ctx.setCurUser('')}> Log out</CButton><br/>
      <Link to={"/auth1"}> Auth 1 </Link><br/>
      <Link to={"/auth2"}> Auth 2 </Link><br/>
      <Link to={"/noauth"}> no auth </Link><br/>
    </>
  )
}

export default TestComponent
