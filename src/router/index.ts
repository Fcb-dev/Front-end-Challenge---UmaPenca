import Vue from 'vue';
import VueRouter from 'vue-router';
import CatalogPage from '../pages/CatalogPage.vue';
Vue.use(VueRouter);
export const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'catalog', component: CatalogPage },
    { path: '/produto/:id', name: 'product', component: () => import('../pages/ProductPage.vue') },
    { path: '*', component: () => import('../pages/NotFoundPage.vue') },
  ],
  scrollBehavior(to, from, saved) {
    return saved ?? (to.path === from.path ? undefined : { x: 0, y: 0 });
  },
});
router.afterEach((to) => {
  document.title = to.name === 'catalog' ? 'Penca — ideias que vestem' : 'Produto — Penca';
});
