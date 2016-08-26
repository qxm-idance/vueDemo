import {Detect} from './util/utility';

let rpgateway = 'https://rpgateway.51rp.com';
let api = 'https://api.u51.com';

let type = Detect.isRP() ? 2 : 3; //2人品  3管家

if (__DEV__) {
    // api = 'http://10.0.40.135:8080';
    // prefix = ['http://', __DEV_IP_ADDRESS__ === 'undefined' ? '0.0.0.0' : __DEV_IP_ADDRESS__ , ':', __DEV_IP_PORT__].join('')
}
export default {
    problemsTree: `${rpgateway}/crmapi/problem/problemsTree/${type}?_r=${+new Date}`,
    problems: id => `${rpgateway}/crmapi/problem/problems/${type}/${id}?_r=${+new Date}`,
    details: id => `${rpgateway}/crmapi/problem/details/${type}/${id}?_r=${+new Date}`,
    answer: id => `${rpgateway}/crmapi/problem/answer/${id}?_r=${+new Date}`,
    relation: id => `${rpgateway}/crmapi/problem/relation/${id}?_r=${+new Date}`,
    touchuan: id => `${rpgateway}/crmapi/problem/touchuan/${id}?_r=${+new Date}`,
    usefull: `${rpgateway}/crmapi/problem/usefull`,
    rate: `${rpgateway}/crmapi/problem/click`,
    getUserInfo: `https://api.u51.com/usercenter-gateway/api/v1/user/getUserInfo`,
    uploadpic: `${api}/custom-feedback/api/v1/uploadpic`,
    postFeedback: `${api}/custom-feedback/api/v1/post-feedback`
};
