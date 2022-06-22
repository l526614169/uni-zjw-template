<template>
	<view>

	</view>
</template>

<script>
	let that = null;
	let sUserAgent;
	let bIsDtDreamApp;
	let bIsAlipayMini;
	export default {
		data() {
			return {
				ticket: ''
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
			isLoad: () => {
				if (bIsAlipayMini) {
					window.location.replace('https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=zyyjsgcw');
				} else {
					window.location.replace('https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=zyyjsgcw');
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
				if (r != null) return unescape(r[2]);
				return null;
			}
		}
	}
</script>

<style>

</style>
