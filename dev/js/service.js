import api from './api.js';
import VueResource from 'vue-resource';

Vue.use(VueResource);

let Service = () => {
    const http = Vue.http;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charst=UTF-8'
    };
    return {
        // problemsTree: () => http.get(api.problemsTree),
        // problems: (id) => http.get(api.problems(id)),
        // details: (id) => http.get(api.details(id)),
        // answer: (id) => http.get(api.answer(id)),
        problemsTree: (opts = {}) => http.jsonp(api.problemsTree, {}, opts),
        problems: (id) => http.jsonp(api.problems(id)),
        details: (id, page = '') => http.jsonp(api.details(id), {page: page}),
        answer: (id) => http.jsonp(api.answer(id)),
        relation: (id) => http.jsonp(api.relation(id)),
        touchuan: (id) => http.jsonp(api.touchuan(id)),
        getUserInfo: (data) => http.jsonp(api.getUserInfo, data),
        rate: (data) => http.post(api.rate, data, {headers: headers}),
        usefull: (data) => http.post(api.usefull, data, {headers: headers}),
        uploadpic: (data, opts = {}) => http.post(api.uploadpic, data, opts),
        postFeedback: (data, opts = {}) => http.post(api.postFeedback, data, opts) //{emulateJSON: true}
    }
};
Vue.http.options.timeout = 10000;
Vue.http.options.beforeSend = (res) => {
    setTimeout(() => {
        // console.log(res.cancel);
        Vue.http.cancel = res.cancel;
        // console.log(api);
    })
};
// Vue.http.interceptors.push({
//     request: function (req) {
//         if (req.method.toLowerCase() === 'post') {
//             // req.headers['Content-Type'] = 'application/x-www-form-urlencoded; charst=UTF-8';
//         }
//         return req;
//     },
//     response: function (response) {
//         console.log(response);
//
//         return response;
//     }
// });

export default Service();
