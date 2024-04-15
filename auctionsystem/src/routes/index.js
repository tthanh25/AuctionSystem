import Home from '~/pages/Home'
import HeaderOnly from '~/components/Layout/Header'
import AdminLayout from '~/components/Layout/Admin'
import CustomerLayout from '~/components/Layout/Customer'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import Detail from '~/pages/Detail'
import Upload from '~/pages/Upload'
import Manage from '~/pages/Manage'
const publicRoutes = [
    {path: '/', component : Home  },
    {path: '/login', component : Login},
    {path: '/register', component : Register},
    {path: '/detail/:itemId', component: Detail},
    
]

const privateRoutes = [
    {path: '/upload', component : Upload, layout: AdminLayout},
    {path: '/manage', component : Manage, layout: AdminLayout},
    {path: '/', component : Home , layout: HeaderOnly },
    {path: '/admin', component : Home, layout: AdminLayout},
    {path: '/customer', component : Home, layout: CustomerLayout},
    {path: '/payment', component : Home, layout: CustomerLayout},
    {path: '/customer/detail/:itemId', component: Detail, CustomerLayout},
]

export {
    publicRoutes,privateRoutes
}