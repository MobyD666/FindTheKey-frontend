import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Config from '../views/Config.vue'; // Assume you have this view
import Main from '../views/Main.vue'; // Assume you have this view

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/config',
    name: 'Config',
    component: Config,
    // Optionally use query parameters here
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    // Optionally use query parameters here
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
