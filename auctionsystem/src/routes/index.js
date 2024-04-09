import Home from '~/pages/Home'
import HeaderOnly from '~/components/Layout/Header'
import AdminLayout from '~/components/Layout/Admin'
import CustomerLayout from '~/components/Layout/Customer'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import Detail from '~/pages/Detail'
const publicRoutes = [
    {path: '/', component : Home  },
    {path: '/login', component : Login},
    {path: '/register', component : Register},
    {path: '/payment', component : Home},
    {path: '/detail/:itemId', component: Detail},
    {path: '/admin', component : Home, layout: AdminLayout},
    {path: '/customer', component : Home, layout: CustomerLayout},
    
]

const privateRoutes = [
    {path: '/manage', component : Home, layout: AdminLayout},
]

export {
    publicRoutes,privateRoutes
}