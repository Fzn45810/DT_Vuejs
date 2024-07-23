import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/Login.vue';
import HomeView from '../views/Home.vue';
import DetailView from '../views/Detail.vue';
import auth from '../services/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: DetailView
    }
  ]
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const publicPages = ['login'];
  const authRequired = to.name ? !publicPages.includes(to.name.toString()) : false;
  const loggedIn = auth.isLoggedIn();

  if (authRequired && !loggedIn) {
    return next({ name: 'login' });
  }

  next();
});

export default router;
