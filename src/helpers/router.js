import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../views/HomePage'
import LoginPage from '../views/UserLogin'
import RegisterPage from '../views/UserRegister'

const routes = [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/.**', component: HomePage },
  ]
  
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router;

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
})