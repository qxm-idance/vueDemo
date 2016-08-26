<template>
    <div class="page help" transition="l0">
        <header-bar title="帮助中心"></header-bar>
    	<div class="ui-content">
	        <Grid :items="items"></Grid>
	        <div class="am-list" am-mode="flat chip 43px">
	            <div class="am-list-header">热门问题</div>
	        </div>
	        <div class="ui_grids help_grids ui_grids{{$index}}" :transtion="cateTra" v-for="its in hotItems" track-by="$index">
	        	<div class="ui_grid js_grid help_grid_hd" v-touch:tap="showMore(its)">
	        		<div class="ui-middle">
	        			<div class="ui_grid_icon">
                            <img :src="its.img">
                        </div>
                        <p class="ui_grid_label">{{its.name}}</p>
                        <span v-if="+its.defaultnum < its.children.length" class="am-icon ui-center"
                            :am-mode="'arrow-vertical' + (its.__more__ ? ' up' : '')"></span>
	        		</div>
	        	</div>
	        	<div class="ui_grid js_grid  help_grid_bd">
                    <div class="ui-list-item"
                        v-for="it in its.children | limit its.__limit__"
                        track-by="$index" v-touch:tap="router(it, its)">
                        <div class="ui-list-content">{{ it&&it.problem}}</div>
                    </div>
                </div>
	        </div>
	    </div>
        <footer-bar></footer-bar>
        <toast :type.sync="type" :text="toastText"></toast>
    </div>
</template>
<script> 
import Grid from '../ui/Grid.vue';
import HeaderBar from '../ui/HeaderBar.vue';
import FooterBar from '../ui/FooterBar.vue';
import Toast from '../ui/toast.vue';
import Service from '../service.js';
import {URLParser, GetParams, Noop} from '../util/utility.js';
export default {
	components:{
		Grid,
        HeaderBar,
        FooterBar,
		Toast
	},
	data() {
		return{
			items: [],
            hotItems: [],
            toastText: '载入中',
            img: [],
            cateTra: 'grid',
            type: 0,
            cancel: Noop,
            urlParams: URLParser(),
            id: [7, 84, 138, 3, 6, 55],
            category: ['人品贷', '人品宝', '服务', '信用卡账单', '信用卡还款', '其他']
		}	 		
	},
	methods: {
		init(){
			this.category.map((it,index) =>{
			this.img.push(require(`../../img/i-nav-${index}.png`));
			this.items.push({link:'category', name:it, img:this.img[index], id:this.id[index]})
			// console.log(this.items);
			});
			Service.problemsTree({beforeSend: (res) => {
                setTimeout(() => {
                    this.cancel = res.cancel;
                });
            }}).then(res => {
                res = res.data;
                this.type = 0;
                this.hotItems = this.handleData(res);
                setTimeout(() => {
                    this.cateTra = '';
                }, 300);
            }, this.onerror);
		},
		onerror(res) {
            console.log(res);
            this.type = 2;
            this.toastText = `${res.msg || '网络开小差'}`;
        },
        handleData(res) {
            let cft = res.config.data,
                data = res.data,
                _cfg = {};
            cft.map(it => {
                switch(it.problemtype) {
                    case '1':
                    _cfg['1'] = it;
                    break;
                    case '2':
                    _cfg['0'] = it;
                    break;
                }
            });
            data.map((it, index) => {
                //站位
                if (it.children.length < +_cfg[it.ishot].defaultnum) {
                    it.children.length = +_cfg[it.ishot].defaultnum;
                }
                //预设值
                it.__limit__ = _cfg[it.ishot].defaultnum;
                it.__more__ = false;
                console.log(this.id.indexOf(+it.id));
                Object.assign(it, _cfg[it.ishot], {img: this.img[this.id.indexOf(+it.id)]});
            });
            return data
        },
        showMore(its) {
            its.__more__ = !its.__more__;
            its.__limit__ = its.__more__ ? its.maxnum : its.defaultnum;
        },
        router(it ,its) {
            this.$router.go(['/category/', it.problemtype, '/list/', 0, '/details/', it.autoid, '?', GetParams({name: its.name})].join(''));
        }
	},
	filters: {
        limit: function(arr, limit) {
        	console.log(arr)
            return arr.slice(0, Number(limit))
        }
    },
	created() {
        console.log(this.$el);
        this.init();
    },
    detached() {
        this.cancel();
        // this.cancel = Noop;
    }

}
</script>
