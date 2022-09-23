/* eslint-disable */

import React, {createContext, Suspense, useContext, useState} from 'react'
import {HashRouter, Route, Routes} from 'react-router-dom'
import './scss/style.scss'

import ModalAuth from "./modalauth/ModalAuth";
import LoginApi from "./api/LoginApi";
import {initModalAuthState, useModalAuth} from "./modalauth/InitAuthState";
import MyFiles from "./views/files/MyFiles";


const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
// const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const TestComponent = React.lazy(() => import('./views/pages/TestComponent'))

export const ModalAuthContext = createContext(initModalAuthState);

const App = () => {

  // const modalAuthState = useModalAuth(LoginApi.fakeLogin, 5, LoginApi.fakeRefreshToken);
  // const modalAuthState = useModalAuth(LoginApi.login, 5, LoginApi.fakeRefreshToken);
  const modalAuthState = useModalAuth(LoginApi.login, 240, LoginApi.refresh);
  // const modalAuthState = useModalAuth(LoginApi.login, 10, LoginApi.refresh);

  return (
    <ModalAuthContext.Provider value={modalAuthState}>
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login/>}/>
            <Route exact path="/register" name="Register Page" element={<Register/>}/>
            <Route exact path="/404" name="Page 404" element={<Page404/>}/>
            <Route exact path="/500" name="Page 500" element={<Page500/>}/>

            <Route exact path="/auth1" name="auth 1"
                   element={<ModalAuth authContext={ModalAuthContext}><TestComponent text={"Auth 1"}/></ModalAuth>}/>

            <Route exact path="/auth2" name="Auth 2"
                   element={<ModalAuth authContext={ModalAuthContext}><TestComponent text={"Auth 2"}/></ModalAuth>}/>

            <Route exact path="/noauth" name="No auth" element={<TestComponent text={"No auth"}/>}/>

            <Route path="/" name="Home" element={<ModalAuth authContext={ModalAuthContext}><MyFiles /></ModalAuth>}/>
          </Routes>
        </Suspense>
      </HashRouter>
    </ModalAuthContext.Provider>
  )

}

export default App
