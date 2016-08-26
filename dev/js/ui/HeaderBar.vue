<template>
    <header class="ui-header">
        <h1 v-text="title"></h1>
        <div class="ui-header-return" v-touch:tap="router()">
            <i class="am-icon" am-mode="arrow-horizontal left"></i>{{leftText || '返回'}}
        </div>
        <div class="ui-header-addition" v-touch:tap="addition()" v-html="rightTpl"></div>
    </header>
</template>
<script>
    import historyPath from '../store/historyPath';
    export default {
        props: {
            title: '',
            rightTpl: '',
            leftText: '',
            rightFn: '',
            leftFn: ''
        },
        methods: {
            addition() {
                if (this.rightFn) {
                    this.$parent[this.rightFn]();
                }
            },
            router() {
                let {
                    get,
                    remove,
                    last
                } = historyPath;
                let {
                    $router,
                    $route
                } = this;

                if (this.leftFn) {
                    this.$parent[this.leftFn]();
                    return
                }
                if (get().length && $route.path !== '/' && $route.path.slice(0, 2) !== '/?') {
                    window.history.go(-1);
                } else {
                    PG.exitApp();
                }
            }
        }
    }
</script>
