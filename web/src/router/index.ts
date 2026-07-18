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
      path: '/digest',
      name: 'digest',
      component: () => import('@/views/DigestView.vue'),
    },
    {
      path: '/hash',
      redirect: '/digest',
    },
    {
      path: '/codec',
      name: 'codec',
      component: () => import('@/views/CodecView.vue'),
    },
    {
      path: '/file-hash',
      redirect: { path: '/digest', query: { type: 'file' } },
    },
    {
      path: '/token',
      name: 'token',
      component: () => import('@/views/TokenView.vue'),
    },
    {
      path: '/asymmetric',
      name: 'asymmetric',
      component: () => import('@/views/AsymmetricView.vue'),
    },
  ],
});

export default router;
