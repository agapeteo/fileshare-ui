/* eslint-disable */

import {useContext, useEffect} from "react";
import {CButton} from "@coreui/react";

const MockLogin = ({authContext}) => {
  const ctx = useContext(authContext);

  useEffect(() => {
    // ctx.setTestMsg("mock text")
  })

  return (
    <>
      <h2>MockLogin: {ctx ? ctx.testMsg : "none"}</h2>
      <CButton onClick={() => ctx.handlerFunc()}> click me now! </CButton>
    </>
  )
}
export default MockLogin;
