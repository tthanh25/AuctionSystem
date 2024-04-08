import Home from '~/pages/Home'
import HeaderOnly from '~/components/Layout/Header'
import AdminLayout from '~/components/Layout/Admin'
import CustomerLayout from '~/components/Layout/Customer'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import Detail from '~/pages/Detail'
const publicRoutes = [
    {path: '/', component : Home, layout: HeaderOnly},
    {path: '/login', component : Login, layout: HeaderOnly},
    {path: '/register', component : Register, layout: HeaderOnly},
    {path: '/payment', component : Home, layout: HeaderOnly},
    {path: '/detail/:itemId', component: Detail},
    
]

const privateRoutes = [
    {path: '/manage', component : Home, layout: HeaderOnly},
    {path: '/admin', component : Home, layout: AdminLayout},
    {path: '/customer', component : Home, layout: CustomerLayout},
    {path: '/detail/:itemId', component: Detail},

]

export {
    publicRoutes,privateRoutes
}