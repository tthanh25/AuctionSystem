import AdminLayout from "~/components/Layout/Admin";
import CustomerLayout from "~/components/Layout/Customer";

  function Protected({ role, path, children }) {
    if (
      role == 1 &&
      (path == "/admin" ||
        path == "/approve")
    )
      return children;
    else if (
      role == 0 &&
      (path == "/customer" ||
        path == "/payment" || path == "/upload" ||
      path == "/detail/:itemId")
    )
      return children;
    else return <h1>Bạn không có quyền truy cập</h1>;
  }
  
  export default Protected;
  