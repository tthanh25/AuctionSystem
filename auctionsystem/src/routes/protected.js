import AdminLayout from "~/components/Layout/Admin";
import CustomerLayout from "~/components/Layout/Customer";

function Protected({ role, path, children,isLogged }) {
    if (isLogged && path == `/detail/:itemId` && role == 1)  { return (
      <AdminLayout>{children}</AdminLayout>
      )
      }
    if (isLogged && path == `/detail/:itemId` && role == 0)  { return (
      <CustomerLayout>{children}</CustomerLayout>
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
  