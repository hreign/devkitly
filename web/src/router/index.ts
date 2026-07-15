import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/qr',
      name: 'qr',
      component: () => import('@/views/QrCodeView.vue'),
    },
    {
      path: '/uuid',
      name: 'uuid',
      component: () => import('@/views/UuidView.vue'),
    },
    {
      path: '/password',
      name: 'password',
      component: () => import('@/views/PasswordView.vue'),
    },
    {
      path: '/hash',
      name: 'hash',
      component: () => import('@/views/HashView.vue'),
    },
    {
      path: '/codec',
      name: 'codec',
      component: () => import('@/views/CodecView.vue'),
    },
    {
      path: '/file-hash',
      name: 'file-hash',
      component: () => import('@/views/FileHashView.vue'),
    },
    {
      path: '/token',
      name: 'token',
      component: () => import('@/views/TokenView.vue'),
    },
  ],
});

export default router;
