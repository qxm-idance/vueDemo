import Vue from 'vue';
import VueRouter from 'vue-router';
import VueTouch from 'vue-touch';

import Main from './view/main.vue';
import Index from './view/index.vue';


import historyPath from './store/historyPath';
import './util/polyfill.js';
import {Transition} from './util/utility.js';

import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.use(VueRouter);
Vue.use(VueTouch);

let router = new VueRouter(
    {
        // history: true,
        // saveScrollPosition: true
    }
);

router.map({
    '/': {
        component: Index,
        name: '/'
    }
});

router.redirect({
    '*': '/'
});

// Vue.transition('l0', {
//     enterClass: 'page-from-left-to-center',
//     leaveClass: 'page-from-center-to-left'
// });

// Vue.transition('l1', {
//     enterClass: 'page-from-right-to-center',
//     leaveClass: 'page-from-center-to-right'
// });

// router.beforeEach(({from, to, next}) => {
//     historyPath.add(from.path);
//     if (Transition.supportStorage() && from.name && to.name) {
//         if(to.name === from.name) {
//             sessionStorage.setItem('to' , '');
//         } else if (to.name.hasString(from.name)) {
//             sessionStorage.setItem('to' , 'l1');
//         } else if (from.name.hasString(to.name)) {
//             sessionStorage.setItem('to' , 'l0');
//         }
//     }
//     next();
// });

router.start(Main, '#main');
//防止某些几率关不掉情况
PG.exec("hideNavigationBar", null, null);
PG.exec("hideNavigationBar", null, null);
