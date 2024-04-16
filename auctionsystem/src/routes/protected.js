import AdminLayout from "~/components/Layout/Admin";
import CustomerLayout from "~/components/Layout/Customer";

  function Protected({ path, children }) {
    let isLogged = false;
    if(localStorage.getItem("isLogged")) isLogged = true ;
    let role = 3;
    if(localStorage.getItem("role")) role = localStorage.getItem("role") ;
    if  (path == '/' || path =='/login' || path == '/register') return children 
    if (isLogged)
    {if ( isLogged &&
      role == 1 &&
      (path == "/admin" ||
        path == "/upload" || path == "/manage" ||
        path == "/detail/:itemId")
    )
      return children;
   } 
   if ( isLogged &&
      role == 0 &&
      (path == "/customer" ||
        path == "/payment" ||
      path == "/detail/:itemId")
    )
      return children;
    else if (!isLogged && path =="/detail/:itemId") return children
    
    return <h1>Bạn không có quyền truy cập</h1>;
  }
  
  export default Protected;
  