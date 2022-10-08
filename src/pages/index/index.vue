<template>
	<view>{{ticket}}</view>
</template>

<script>
	import { mgop } from '@aligov/jssdk-mgop';
	import md5Libs from "uview-ui/libs/function/md5";
	import CryptoJS from 'crypto-js/crypto-js';
	import appConfig from '@/common/config';

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
				that.getUserInfo();
			},
			getUserInfo:()=>{
				//验证临时票据的有效性
				that.getTonkenAndUserInfo(that.getHeader(), that.getTonkenAndUserInfoParams()).then(data => {
					that.userInfo.username = data.username;
					that.userInfo.userid = data.userid;
					that.$utils.initZwlog(data.userid, data.username);
					//使用令牌获取用户详细信息
					return that.getTonkenAndUserInfo(that.getHeader('IC33000020220228000004'), that.getTonkenAndUserInfoParams('getUserInfo',
						data.token), 'getUserInfo');
				}).then(data => {
					that.userInfo.idnum = data.idnum;
					that.userInfo.mobile = data.mobile;
					return ZWJSBridge.getUserType({});
				}).then(res => {
					that.userType = res.userType;
					uni.setStorageSync('userInfo', that.userInfo);
				}).catch(err => {
					console.log(err);
					ZWJSBridge.alert({
						title: '提示',
						buttonName: '确定',
						message: `接口错误${err}`
					})
				});
			},
			getTonkenAndUserInfo: (header, data, method = 'ticketValidation') => {
				return new Promise((resolve, reject) => {
					mgop({
						api: `mgop.zjzwfw.${appConfig.appCode}.${method}`, //API名称,见政务中台RPC接入--API管理
						host: 'https://mapi.zjzwfw.gov.cn/',
						data: data,
						dataType: 'JSON',
						type: 'POST',
						appKey: appConfig.appKey, //应用APPKey
						header: header,
						onSuccess: res => {
							if (res.data.result && res.data.result == 0) {
								resolve(res.data);
							} else {
								reject(res.data.errmsg)
							}
						},
						onFail: err => {
							reject(err);
						}
					});
				})
			},
			getTonkenAndUserInfoParams: (method = 'ticketValidation', token = '') => {
				let mTime = that.$u.timeFormat(new Date(), 'yyyymmddhhMMss');
				let data = {
					method: method,
					servicecode: appConfig.serviceCode,
					time: mTime,
					sign: md5Libs.md5(`${appConfig.serviceCode}${appConfig.servicePwd}${mTime}`),
					datatype: 'json'
				}
				if (token == '') {
					data.st = that.ticket;
				} else {
					data.token = token;
				}
				return data;
			},
			getHeader: (subPath = 'IC33000020220228000002') => {
				let accessKey = appConfig.accessKey;
				let secret = appConfig.secret;
				let path = `/restapi/prod/${subPath}/sso/servlet/simpleauth`;
				let queryString = "";
				let xTime = (new Date()).toGMTString();
				let singString = "POST" + "\n" + path + "\n" + queryString + "\n" + accessKey + "\n" + xTime + "\n";
				let hash = CryptoJS.HmacSHA256(singString, secret);
				let hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
				return {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-BG-HMAC-ACCESS-KEY': accessKey,
					'X-BG-HMAC-SIGNATURE': hashInBase64,
					'X-BG-HMAC-ALGORITHM': 'hmac-sha256',
					'X-BG-DATE-TIME': xTime,
				};
			},
		}
	}
</script>

<style lang="scss">

</style>
