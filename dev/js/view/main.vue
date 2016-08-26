<template>
    <div class="container">
        <router-view
            class="view"
            keep-alive>
        </router-view>
    </div>
</template>
<script>
import historyPath from '../store/historyPath';
export default {
    methods: {
        init() {
            PG.onBackKeyPress = () => {
                let {
                    get
                } = historyPath;
                let {
                    $router,
                    $route
                } = this;

                if (get().length && $route.path !== '/' && $route.path.slice(0, 2) !== '/?') {
                    window.history.go(-1);
                    return false;
                } else {
                    PG.exitApp();
                    return true;
                }
            }
        }
    },
    created() {
        this.init();
    }
}
</script>
