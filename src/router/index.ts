import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {getRouter} from '../http/api';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect:"order"
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由拦截
router.beforeEach(async (to)=>{
  // 如果没有登录，则只能进去登录页面
  const token:string | null = localStorage.getItem('token')
  if(!token && to.path !== "/login"){
    return '/login'
  }else if(to.path!=='/login'&&token){
    if(router.getRoutes().length===3){
      // 动态添加路由
      let routerData:any = await getRouter()
      routerData = routerData.data

      routerData.forEach((v:any)=>{
        const routerObj:RouteRecordRaw = {
              path:v.name,
              name:v.name,
              meta:v.meta,
              component: () => import(/* webpackChunkName: "[request]" */ `../views/${v.path}.vue`)
          }
          router.addRoute("home",routerObj)
      })
      router.replace(to.path)
    }

  }else if(to.path==='/login'&&token){
    return '/'
  }
})

export default router
