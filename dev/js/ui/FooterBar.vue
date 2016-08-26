<template>
    <footer class="ui-footer">
        <div class="weui_grids">

            <!-- <a class="weui_grid js_grid" href="javascript:;" v-touch:tap="goForum()">
                <div class="weui_grid_label">
                    <img :src="img[1]"><span>51论坛</span>
                </div>
            </a> -->
            <a class="weui_grid js_grid" href="javascript:;" v-touch:tap="goContact()">
                <div class="weui_grid_label">
                    <img :src="img[2]">
                    <span>联系我们</span>
                </div>
            </a>
            <a class="weui_grid js_grid" href="javascript:;" v-touch:tap="goService()">
                <div class="weui_grid_label">
                    <img :src="img[0]"><span>智能客服</span>
                </div>
            </a>
            <a class="weui_grid js_grid" href="javascript:;" v-touch:tap="goFeedback()">
                <div class="weui_grid_label">
                    <img :src="img[3]"><span>建议反馈</span>
                </div>
            </a>
        </div>
    </footer>
</template>
<script>
    import {URLParser, GetParams} from '../util/utility.js';
    import Service from '../service.js';

    const {
        user_id,
        token
    } = URLParser();

    export default {
        data() {
            return {
                img: [],
                user: {}
            }
        },
        methods: {
            init() {
                for(let i = 0; i < 4; i++) {
                    this.img.push(require(`../../img/i-footer-${i}.png`))
                }
                // Service.getUserInfo({userId: user_id, token: decodeURIComponent(token)}).then(res => {
                Service.getUserInfo({userId: user_id, token: decodeURIComponent(token)}).then(res => {
                    res = res.data;
                    if (!res.code) {
                        // let u = res.User;
                        // this.user = {
                        //     display_name: encodeURIComponent(u.display_name),
                        //     mobile: u.mobile,
                        //     sex: u.sex
                        // };
                        this.user = res.User;
                    }
                })
            },
            goService() {
                let {
                    user_id,
                    mobile,
                    display_name
                } = this.user;

                PG.exec('openWebView', null,
                    {
                        url: ["http://u51.udesk.cn/im_client?", 'c_cf_UserId=', user_id, '&c_phone=', mobile, '&c_name=', encodeURIComponent(display_name)].join(''),
                        title: '智能客服',
                        push: true
                    });
                // console.log(["http://u51.udesk.cn/im_client?", 'web_token=', user_id, '&c_phone=', mobile, '&c_name=', encodeURIComponent(display_name)].join(''))
                // console.log(["u51.udesk.cn/im_client?", 'web_token=', id, '&c_phone=', mobile, '&c_name=', name]join(''))
                    // console.log(GetParams(Object.assign(URLParser(), this.user)));
                // console.log(['https://www.u51.com/help/webim.html?', GetParams(Object.assign(URLParser(), this.user))].join(''));
                // this.$router.go(['/im?', GetParams({name: '智能客服'}, this.user)].join(''));
            },
            goForum() {
                PG.exec('showActivity', null, {actionType: 4, actionValue: 'http://credit.u51.com'});
            },
            goFeedback() {
                this.$router.go(['/feedback?', GetParams({name: '建议反馈', token: decodeURIComponent(token)})].join(''));
            },
            goContact() {
                this.$router.go(['/contact?', GetParams({name: '联系我们'})].join(''));
            }
        },
        created() {
            this.init();
        }
    }
</script>
