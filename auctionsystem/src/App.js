import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { useEffect, useLayoutEffect, useState } from 'react';
import Protected from './routes/protected';
import { createContext } from 'react';
import HeaderOnly from './components/Layout/Header';
import AdminLayout from './components/Layout/Admin';
import CustomerLayout from './components/Layout/Customer';

function App() { 
  const role = JSON.parse(localStorage.getItem("role"));
  const isLogged = JSON.parse(localStorage.getItem("isLogged"));
  let Layout = HeaderOnly;
  return (
            <Router>
        <div className='App'>
         <Routes>
            {
              publicRoutes.map((route,index) => {
                const Page = route.component
                if(route.layout) Layout = route.layout
                return <Route key={index} path={route.path} element={
                  <Protected role={role } path={route.path}><Layout><Page/></Layout></Protected>
                } />
              })
            }
            { isLogged &&
              privateRoutes.map((route,index) => {
                const Page = route.component
                Layout = route.layout
                return <Route key={index} path={route.path} element={
                  <Protected role={role } path={route.path}><Layout><Page/></Layout></Protected>
                } />
              })
            }
         </Routes>
        </div>
      </Router>


  );
}

export default App;
