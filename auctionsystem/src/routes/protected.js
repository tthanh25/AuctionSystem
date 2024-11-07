import AdminLayout from "~/components/Layout/Admin";
import CustomerLayout from "~/components/Layout/Customer";
import HeaderOnly from "~/components/Layout/Header";
import _ from 'lodash'; // Ensure lodash is imported

function Protected({ path, children }) {
  let isLogged = false;
  if(localStorage.getItem("isLogged")) isLogged = true ;
  let role = 3; // Default to 3 if not set
  role = parseInt(localStorage.getItem("role"), 10)
    // Allow public access for certain paths
    if (_.isEqual(path, '/') || _.isEqual(path, '/login') || _.isEqual(path, '/register')) {
        return <HeaderOnly>{children}</HeaderOnly>;
    } 

    if (isLogged) {
        console.log("role 1:");
        console.log(_.isEqual(role, 1));
        console.log("role 0:", role);
        console.log(_.isEqual(role, 0));
        console.log("isLogged: ");
        console.log(_.isEqual(isLogged, true));
        if (_.isEqual(role, 1)) {
            if (_.isEqual(path, "/admin") || 
                _.isEqual(path, "/upload") || 
                _.isEqual(path, "/manage") || 
                path.startsWith("/detail/") || 
                path.startsWith("/update/")) {
                return <AdminLayout>{children}</AdminLayout>;
            } else {
                return <h1>Bạn không có quyền truy cập</h1>;
            }
        } 
        
        // Customer access
        else if (_.isEqual(role, 0)) {
            if ((_.isEqual(path, "/customer") || 
                 _.isEqual(path, "/payment") || 
                 path.startsWith("/detail/") || 
                 _.isEqual(path, "/transaction")) 
                 ||
                (_.isEqual(path, "/admin") || 
                  _.isEqual(path, "/upload") || 
                  _.isEqual(path, "/manage") || 
                  path.startsWith("/update/"))
                ) {
                return <CustomerLayout>{children}</CustomerLayout>;
            } else {
                return <h1>Bạn không có quyền truy cập</h1>;
            }
        }
    } 
    
    // Allow public access to detail page for guests
    if (path.startsWith("/detail/")) {
        return <HeaderOnly>{children}</HeaderOnly>;
    }

    // Deny access
    return <h1>Bạn không có quyền truy cập</h1>;
     
    // return <AdminLayout>{children}</AdminLayout>
}

export default Protected;