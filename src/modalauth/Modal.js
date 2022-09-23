/* eslint-disable */

import React from 'react';
// import './Modal.css'

const Modal = ({visible, children}) => {
  return (
    <>
      <div className={visible ? "modal show-modal" : "modal"}>
        <div className={"modal-content"}>
          {children}
        </div>
      </div>
    </>
  )
}

export default Modal
