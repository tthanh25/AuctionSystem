import AdminLayout from "~/components/Layout/Admin";
import CustomerLayout from "~/components/Layout/Customer";

function Protected({ role, path, children,isLogged }) {
    if (path == "/" || path == "/login" || path == "/register" || path == "/payment" || path == "/detail/:itemId") return (children)
    if (isLogged && path == "/detail/:itemId" && role == 1)  { return (
      {children}
      )
      }
    if (isLogged && path == "/detail/:itemId" && role == 0)  { return (
      {children}
    )
      }
    if ( 
      role == 1 &&
      (path == "/admin" ||
        path == "/manage" 
        )
    )
     { return (children)

      }
    else if (
      role == 0 && (path == "/customer")
    )
      {return (children)
      ;}
    else return <h1>Bạn không có quyền truy cập</h1>;
  }
  
  export default Protected;
  