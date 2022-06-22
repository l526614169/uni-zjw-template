let config = {
	baseUrl: 'https://localhost', // 请求的根域名
	// 默认的请求头
	header: {
		"Content-Type": "application/json"
	},
	method: 'POST',
}

function base_request(api, data, method, header) {
	const isToken = header.isToken === false
	if (uni.getStorageSync('token') && !isToken) {
		header.Authorization = uni.getStorageSync('token');
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.baseUrl + api,
			data: data || {},
			method: method,
			header: Object.assign({}, config.header, header),
			success: (res) => {
				if (res.statusCode == 200 && res.data.code == 200) {
					resolve(res.data);
				} else if (res.data.code == 700 && res.data.msg) {
					uni.$u.toast(res.data.msg || '网络错误,请稍后重试!');
				} else {
					uni.$u.toast('网络错误,请稍后重试!');
					reject(res);
				}
			},
			fail: (err) => {
				uni.$u.toast('网络错误,请稍后重试!');
				reject(err.errMsg);
			}
		})
	})
}

function postMethod(api, data = {}, header = {}) {
	return base_request(api, data, 'POST', header);
}

function getMethod(api, data = {}, header = {}) {
	return base_request(api, data, 'GET', header);
}

const $request = {
	baseUrl: config.baseUrl,
}

const install = Vue => {
	Vue.prototype.$request = $request
}

export default {
	install
}
