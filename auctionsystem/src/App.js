import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { useState } from 'react';
import Protected from './routes/protected';
import { createContext } from 'react';
import HeaderOnly from './components/Layout/Header';

export const LayoutContext = createContext();
export const getRole = createContext();

function App() {
  const [isLogged, setIsLogged] = useState(localStorage.getItem("isLogged")); 
  const [role, setRole] = useState(localStorage.getItem("role"));
  return (
    <getRole.Provider value = {setRole}>
      <LayoutContext.Provider value={setIsLogged}>
            <Router>
        <div className='App'>
         <Routes>
            {
              publicRoutes.map((route,index) => {
                const Page = route.component
                let Layout = HeaderOnly
                if(route.layout) Layout = route.layout
                return <Route key={index} path={route.path} element={<Layout><Page/></Layout>} />
              })
            }
            { isLogged &&
              privateRoutes.map((route,index) => {
                const Page = route.component
                let Layout = route.layout
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
