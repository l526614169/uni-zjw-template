<template>
	<view>{{ticket}}</view>
</template>

<script>
	import {
		mgop
	} from '@aligov/jssdk-mgop';
	import md5Libs from "uview-ui/libs/function/md5";
	let that = null;
	export default {
		data() {
			return {
				ticket: '',
				uiStyle: 'normal',
				userInfo: {
					idnum: '',
					mobile: '',
					userid: '',
					username: ''
				},
				userType: null,
				longitud: null,
				latitude: null
			}
		},
		onLoad(options) {
			that = this;
			that.ticket = options.ticket;
			that.init();
		},
		methods: {
			init: () => {
				ZWJSBridge.setTitle({
					title: '测试应用'
				});
				ZWJSBridge.getUiStyle().then(res => {
					switch (res.uiStyle) {
						case 'elder':
							that.uiStyle = res.uiStyle;
							break;
						default:
							that.uiStyle = 'normal';
					}
					uni.setStorageSync('uiStyle', that.uiStyle);
				});
			},
			aplus: () => {
				aplus_queue.push({
					action: 'aplus.sendPV',
					arguments: [{
						is_auto: false
					}, {
						miniAppId: '测试应用ID',
						miniAppName: '测试应用',
						long: that.longitude,
						lati: that.latitude,
						userType: that.userType,
					}]
				});
				aplus_queue.push({
					action: 'aplus.setMetaInfo',
					arguments: ['_user_nick', that.userInfo.username]
				});
				aplus_queue.push({
					action: 'aplus.setMetaInfo',
					arguments: ['_user_id', that.userInfo.userid]
				});
				aplus_queue.push({
					action: 'aplus.setMetaInfo',
					arguments: ['_hold', 'START']
				});
			},
		}
	}
</script>

<style lang="scss">

</style>
