function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	let hour = parseInt(time / 3600)
	time = time % 3600
	let minute = parseInt(time / 60)
	time = time % 60
	let second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

let dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		let humanize = '';
		for (let key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		let date = this.parse(dateStr)
		let diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		let _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		let a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

function initMap() {
	return new Promise((resolve, reject) => {
		if (window.AMap) {
			resolve(window.AMap)
		} else {
			const key = '';
			let url = `https://webapi.amap.com/maps?v=1.4.15&key=${key}&callback=onLoad`;
			let jsapi = document.createElement('script');
			jsapi.charset = 'utf-8';
			jsapi.src = url;
			document.head.appendChild(jsapi);
		}
		window.onLoad = () => {
			resolve(window.AMap)
		}
	})
}

function desensitization(str, beginLen, endLen = -1) {
	let len = str.length;
	if (beginLen == 0) {
		endLen = endLen * len + 1;
	}
	let firstStr = str.substr(0, beginLen);
	let lastStr = str.substr(endLen);
	let middleStr = str.substring(beginLen, len - Math.abs(endLen)).replace(/[\s\S]/ig, '*');
	return `${firstStr}${middleStr}${lastStr}`;
}

const $utils = {
	formatTime: formatTime,
	dateUtils: dateUtils,
	initMap: initMap,
	desensitization: desensitization,
}

const install = Vue => {
	Vue.prototype.$utils = $utils
}

export default {
	install
}
