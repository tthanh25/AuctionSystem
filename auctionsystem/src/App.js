import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import Protected from './routes/protected';
import HeaderOnly from './components/Layout/Header';

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
                  <Protected role={role } path={route.path}><Page/></Protected>
                } />
              })
            }
            { isLogged &&
              privateRoutes.map((route,index) => {
                const Page = route.component
                Layout = route.layout
                return <Route key={index} path={route.path} element={
                  <Protected role={role } path={route.path}><Page/></Protected>
                } />
              })
            }
         </Routes>
        </div>
      </Router>


  );
}

export default App;
