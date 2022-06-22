<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// eruda.init()
			ZWJSBridge.onReady(() => {
				console.log('初始化完成后，执行bridge方法')
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	@import "common/css/noiseicon.css";
	
	.white-note {
		width: 200rpx;
		height: 10rpx;
		background-color: #FFF;
		border-radius: 10rpx;
		box-shadow: 0px 4px 16px rgba(69, 91, 99, 0.08);
	}
</style>
