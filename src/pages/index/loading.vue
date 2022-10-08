<template>
	<view>

	</view>
</template>

<script>
	import appConfig from '@/common/config';
	
	let that = null;
	let sUserAgent;
	let bIsDtDreamApp;
	let bIsAlipayMini;
	export default {
		data() {
			return {
				ticket: '',
			}
		},
		onLoad() {
			that = this;
			that.init();
		},
		methods: {
			init: () => {
				ZWJSBridge.setTitle({
					title: '测试应用'
				});
				that.ssoLogin();
			},
			ssoLogin: () => {
				if (ZWJSBridge.ssoTicket) {
					const ssoFlag = await ZWJSBridge.ssoTicket({});
					if (ssoFlag && ssoFlag.result === true) {
						that.watchWxApp();
					} else {
						that.handleAppOrAli();
					}
				} else {
					that.handleAppOrAli();
				}
			},
			isLoad: () => {
				if (bIsAlipayMini) {
					window.location.replace(`https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=${appConfig.serviceCode}`);
				} else {
					window.location.replace(`https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=${appConfig.serviceCode}`);
				}
				// 防外链检测
				// redirectUrl 是单点登录回调参数, 老版本为goto
				// const redirectUrl = 'http://localhost:8080';
				// 如不需要单点登录回调本地调试则可以不添加 redirectUrl
				// 跳转地址需联系官方进行加入白名单操作
				// const code = `${appConfig.serviceCode}&redirectUrl=${redirectUrl}`;
				// if (bIsAlipayMini) {
				// 	window.location.href =
				// 		"https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=" + code;
				// } else {
				// 	window.location.href =
				// 		"https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=" + code;
				// }
			},
			handleAppOrAli: () => {
				sUserAgent = window.navigator.userAgent.toLowerCase();
				bIsDtDreamApp = sUserAgent.indexOf("dtdreamweb") > -1; // 浙里办APP
				bIsAlipayMini = sUserAgent.indexOf("miniprogram") > -1 && sUserAgent.indexOf("alipay") > -1;
				if (that.getQuery('ticket') == null && that.ticket == "") {
					uni.showLoading({
						title: '登录中',
						mask: true
					});
					if (bIsDtDreamApp) {
						that.watchApp();
					} else if (bIsAlipayMini) {
						that.watchApply();
					}
				} else {
					that.ticket = that.getQuery('ticket');
					uni.reLaunch({
						url: `./index?ticket=${that.ticket}`
					})
				}
			},
			watchWxApp: () => {
				//使用 IRS“浙里办”单点登录组件
				if (ssoFlag.ticketId) {
					that.ticket = ssoFlag.ticketId;
				} else {
					//当“浙里办”单点登录失败或登录态失效时调用 ZWJSBridge.openLink 方法重新获取 ticketId。
					ZWJSBridge.openLink({
						type: 'reload'
					}).then(res => {
						that.ticket = res.ticketId;
					})
				}
			},
			watchApp: () => {
				window.onpageshow = (event) => {
					if (event.persisted || (window.performance && window.performance.navigation.type == 2)) {
						ZWJSBridge.close();
					}
					that.isLoad();
				}
			},
			watchApply: () => {
				window.onpageshow = (event) => {
					if (event.persisted || (window.performance && (window.performance.navigation.type == 1 ||
							window.performance.navigation.type == 0))) {
						that.isLoad();
					} else {
						my.navigateBack();
					}
				}
			},
			getQuery: (name) => {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if (r != null) return decodeURIComponent(r[2]);
				return null;
			}
		}
	}
</script>

<style>

</style>
