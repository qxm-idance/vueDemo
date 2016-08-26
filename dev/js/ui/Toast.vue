<template>
    <div class="am-toast" v-if="type">
        <div class="am-toast-text" :style="{height: type < 5 ? '' : 'auto'}">
            <span v-if="type<5" class="am-toast-icon am-icon" am-mode="{{status[type-1]}}"></span> {{text}}
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            type: {
                type: Number,
                required: true,
                default: 0
            },
            text: {
                type: String,
                required: false,
                default: '载入中'
            },
            timeout: {
                type: Number,
                required: false,
                default: 2000
            }
        },
        data() {
            return {
                status: ['toast-loading', 'toast-network', 'toast-success' ,'toast-fail']
            }
        },
        watch: {
            type(r) {
                if (r > 1) {
                    if (this.time) {
                        clearTimeout(this.time);
                        this.time = null;
                    }
                    this.time = setTimeout(() => {
                        this.type = 0;
                    }, this.timeout)
                }
            }
        }
    }
</script>
