import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import HomeLayout from '../layout/HomeLayout.vue'
import Login from '../views/Login.vue'
import Dashboard from '../layout/DashboardLayout.vue'
import Impostazioni from '../views/Impostazioni.vue'
import Vigili from '../views/Vigili.vue'
import Reperibilita from '../views/Reperibilita.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomeLayout',
    component: HomeLayout,
    children: [{
      path: '/',
      components: {
        homepage: Home
      }
    },{
      path: 'login',
      components: {
        homepage: Login
      }
    }]
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [{
      path: '/impostazioni',
      components: {
        loggedContent: Impostazioni
      }
    },{
      path: '/vigili',
      components: {
        loggedContent: Vigili
      }
    },{
      path: '/reperibilita',
      components: {
        loggedContent: Reperibilita
      }
    }]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
