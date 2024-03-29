import Home from '~/pages/Home'
import Header from '~/components/Layout/Header'
import AdminLayout from '~/components/Layout/Admin'
import CustomerLayout from '~/components/Layout/Customer'
const publicRoutes = [
    {path: '/', component : Home, layout: Header},
    {path: '/login', component : Home, layout: Header},
    {path: '/manage', component : Home, layout: Header},
    {path: '/payment', component : Home, layout: Header},
    {path: '/admin', component : Home, layout: AdminLayout},
    {path: '/customer', component : Home, layout: CustomerLayout}

]

const privateRoutes = [

]

export {
    publicRoutes,privateRoutes
}