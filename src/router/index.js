import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import HomeLayout from '../layout/HomeLayout.vue'
import Login from '../views/Login.vue'
import Dashboard from '../layout/DashboardLayout.vue'
import Impostazioni from '../views/Impostazioni.vue'
import Vigili from '../views/Vigili.vue'
import Reperibilita from '../views/Reperibilita.vue'
import RicercaPersona from '../views/RicercaPersona.vue'
import Missioni from '../views/Missioni.vue'
import DettagliMissione from '../views/DettagliMissione.vue'
import RiepilogoGiornaliero from '../views/RiepilogoGiornaliero.vue'
import RiepilogoComplessivo from '../views/RiepilogoComplessivo.vue'
import LiveMap from '../views/LiveMap.vue'
import loginController from '../controllers/loginController';

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
    meta: { requiresAuth: true },
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
    },{
      path: '/ricercapersona',
      name: 'RicercaPersona',
      components: {
        loggedContent: RicercaPersona
      }
    }, {
      path: '/ricercapersona/missioni/:idRicerca',
      name: 'Missioni',
      components: {
        loggedContent: Missioni
      },
      props: true
    }, {
      path: '/ricercapersona/missioni/dettagli/:idMissione',
      name: 'DettagliMissione',
      components: {
        loggedContent: DettagliMissione
      },
      props: true
    }, {
      path: '/ricercapersona/missioni/riepilogo-giornaliero',
      name: 'RiepilogoGiornaliero',
      components: {
        loggedContent: RiepilogoGiornaliero
      },
      props: true
    }, {
      path: '/ricercapersona/missioni/riepilogo-complessivo',
      name: 'RiepilogoComplessivo',
      components: {
        loggedContent: RiepilogoComplessivo
      },
      props: true
    }, {
      path: '/ricercapersona/livemap/:idRicerca',
      name: 'LiveMap',
      components: {
        loggedContent: LiveMap
      },
      props: true
    }]
  }/*,
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(webpackChunkName: "about" '../views/About.vue')
  }*/
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loginController.isTokenValid()) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
