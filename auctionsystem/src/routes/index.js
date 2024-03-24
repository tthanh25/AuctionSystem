import Home from '~/pages/Home'
import Header from '~/components/Layout'

const publicRoutes = [
    {path: '/', component : Home, layout: Header}

]

const privateRoutes = [

]

export {
    publicRoutes,privateRoutes
}