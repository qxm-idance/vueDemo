<template>
    <div class="ui_grids">
        <a class="ui_grid" v-for="item in items" v-touch:tap="router(item)">
            <div class="ui_grid_icon">
                <img :src="item.img">
            </div>
            <p class="ui_grid_label">{{item.name}}</p>
        </a>
    </div>
</template>
<script type="text/javascript">
    export default{
        props:{
            items:{
                type:Array,
                required:true,
                default:[]
            }       
        },
        methods:{
            router(item) {
                this.$router.go([item.link, '/', item.id, '?', GetParams({name: item.name})].join(''));
            }
        }
    }
</script>