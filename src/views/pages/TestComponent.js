/* eslint-disable */

import React, {useContext} from 'react'
import {CButton} from "@coreui/react";
import {ModalAuthContext} from "../../App";
import {Link} from "react-router-dom";

const TestComponent = ({text}) => {
  const ctx = useContext(ModalAuthContext);

  const signOut = async () => {
    await ctx.signOutFn();
  }

  return (
    <>
      <h3>Text: {text}</h3>
      <CButton onClick={() => signOut()}> Log out</CButton><br/>
      <Link to={"/auth1"}> Auth 1 </Link><br/>
      <Link to={"/auth2"}> Auth 2 </Link><br/>
      <Link to={"/noauth"}> no auth </Link><br/>
    </>
  )
}

export default TestComponent
