import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/home', 
    component: Home, 
    redirect: '/welcome', 
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users }
    ] }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const tokenStr = window.sessionStorage.getItem('token')
  if (to.path === '/login' && !tokenStr) {
    return next()
  } else if (to.path === '/login' && tokenStr) {
    next('/home')
  }
  if (!tokenStr) return next('/login')
  next()
})

export default router
