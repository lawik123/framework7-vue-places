import HomePage from './pages/home.vue';
import newLocationPage from './pages/new-location.vue';
import NotFoundPage from './pages/not-found.vue';


export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/new-location',
    component: newLocationPage
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
