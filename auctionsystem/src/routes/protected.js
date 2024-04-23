import AdminLayout from "~/components/Layout/Admin";
import CustomerLayout from "~/components/Layout/Customer";
import HeaderOnly from "~/components/Layout/Header";

  function Protected({ path, children }) {
    let isLogged = false;
    if(localStorage.getItem("isLogged")) isLogged = true ;
    let role = 3;
    if(localStorage.getItem("role")) role = localStorage.getItem("role") ;
    if  (path == '/' || path =='/login' || path == '/register') return (<HeaderOnly>{children}</HeaderOnly>) 
    if (isLogged)
    {if ( isLogged &&
      role == 1 &&
      (path == "/admin" ||
        path == "/upload" || path == "/manage" ||
        path == "/detail/:itemId" || path == "/update/:itemId")
    )
    return (<AdminLayout>{children}</AdminLayout>);
   } 
   if ( isLogged &&
      role == 0 &&
      (path == "/customer" ||
        path == "/payment" ||
      path == "/detail/:itemId")
    )
      return (<CustomerLayout>{children}</CustomerLayout>);
    else if (!isLogged && path =="/detail/:itemId") return (<HeaderOnly>{children}</HeaderOnly>) 
    
    return <h1>Bạn không có quyền truy cập</h1>;
  }
  
  export default Protected;
  