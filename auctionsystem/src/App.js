import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { useEffect, useLayoutEffect, useState } from 'react';
import Protected from './routes/protected';
import { createContext } from 'react';
import HeaderOnly from './components/Layout/Header';
import AdminLayout from './components/Layout/Admin';
import CustomerLayout from './components/Layout/Customer';

export const LayoutContext = createContext();
export const getRole = createContext();

function App() { 
  const [isLogged, setIsLogged] = useState(false);
  const [role, setRole] = useState("3");
  let Layout = HeaderOnly;
  useEffect(() => {
    setIsLogged(localStorage.getItem("isLogged")); 
    setRole(localStorage.getItem("role"));
    if(isLogged && role === 0) Layout = CustomerLayout;
    if (isLogged && role === 1) Layout = AdminLayout;
    console.log(isLogged)
    console.log(role)
  },[role],[isLogged])
  
  console.log(role)
  console.log(isLogged)
  return (
    <getRole.Provider value = {setRole}>
      <LayoutContext.Provider value={setIsLogged}>
            <Router>
        <div className='App'>
         <Routes>
            {
              publicRoutes.map((route,index) => {
                const Page = route.component
                const path = route.path
                if(route.layout) Layout = route.layout
                if (isLogged === true && path === "/detail/:itemId" && role === 1)   return <Route key={index} path={route.path} element={<AdminLayout><Page/></AdminLayout>} />
                   
                if (isLogged === true && path === "/detail/:itemId" && role === 0)   return <Route key={index} path={route.path} element={<CustomerLayout><Page/></CustomerLayout>} />
                
                return <Route key={index} path={route.path} element={<Layout><Page/></Layout>} />
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
      </LayoutContext.Provider>
    </getRole.Provider>

  );
}

export default App;
