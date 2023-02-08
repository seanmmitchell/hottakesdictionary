import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { title: "HTD > Home", auth: false }
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      meta: { title: "HTD > Search", auth: false }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/About.vue'),
      meta: { title: "HTD > About", auth: false }
    },
    { 
      path: "/:pathMatch(.*)*", 
      name: "error-page",
      props: { error: { code: 404, name: "Not Found", description: "At least it is somewhere nice." } },
      component: () => import('../views/Error.vue'),
      meta: { title: "HTD > Error", auth: false }
    }
  ]
})

export default router
