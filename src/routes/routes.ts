import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/index.vue';
import blogpost from '@/views/blogpost.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/blog/:id',
    name: 'blogpost',
    component: blogpost,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;