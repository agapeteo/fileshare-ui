/* eslint-disable */

import {useContext, useEffect} from "react";
import ModalLogin from "./ModalLogin";

const ModalAuth = ({children, authContext}) => {
  const ctx = useContext(authContext);

  useEffect(() => {
    if (!ctx.modalComponent) {
      ctx.setModalComponent(<ModalLogin authContext={authContext}/>)
    }
  })

  return (
    <>
      {children}
      {ctx.modalComponent}
    </>
  )
}

export default ModalAuth;
