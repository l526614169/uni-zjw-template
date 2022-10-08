import appConfig from '../config';

let zwlog;
let pageLogMap = {};

/*
 * *******用户信息采集，同时声明 Zwlog 对象实例
 */
export const initZwlog = (userId, userNickName) => {
	zwlog = new ZwLog({
		_user_id: userId,
		_user_nick: userNickName
	})
}

/*
 * *******PV 日志参数- global_args
 * url 页面路径 【选填】（未传参默认获取当前路由地址）
 * enterPageTime 【必填】（默认在路由改变的时候自动获取时间） 进入页面的时间 new Date()
 * leavePageTime 【必填】（默认在路由改变的时候自动获取时间） 离开页面的时间 new Date()
 * loadTime【必填】（页面onShow中获取当前时间） 加载完的时间 new Date()
 * responseTime 【必填】（页面onShow的nextTick中获取当前时间） 响应完的时间 new Date()
 */
export const zwlogPvGlobal = ({
	url = null,
	enterPageTime = null,
	leavePageTime = null,
	loadTime = null,
	responseTime = null,
	userId = null,
	userName = null
} = {}) => {
	if (!zwlog) return;
	let path = url || getCurRoute();
	if (!path) return;
	if (!pageLogMap.hasOwnProperty(path)) {
		pageLogMap[path] = {
			enterPageTime: null,
			leavePageTime: null,
			loadTime: null,
			responseTime: null,
		};
	}
	if (enterPageTime) pageLogMap[path].enterPageTime = enterPageTime;
	if (leavePageTime) pageLogMap[path].leavePageTime = leavePageTime;
	if (loadTime) pageLogMap[path].loadTime = loadTime;
	if (responseTime) pageLogMap[path].responseTime = responseTime;

	console.log("zheliban === " + path, pageLogMap[path]);
	if (
		pageLogMap[path].enterPageTime &&
		pageLogMap[path].leavePageTime &&
		pageLogMap[path].loadTime &&
		pageLogMap[path].responseTime
	) {
		/*
		 * miniAppId 应用开发管理 平台 appId
		 * miniAppName 应用开发管理 平台应用名称
		 * log_status 用户登录状态 （01:未登录/ 02:单点登录）
		 * Page_duration 浏览时长  用户从进入到离开当 前页面的时长
		 * t2 页面加载时间  页面启动到加载完成 的时间
		 * t0  页面响应时间  页面启动到页面响应 完成的时间
		 * pageId  应用页面 ID
		 * pageName  应用页面名称
		 */
		let Page_duration =
			pageLogMap[path].leavePageTime.getTime() -
			pageLogMap[path].enterPageTime.getTime();
		let t2 =
			pageLogMap[path].loadTime.getTime() -
			pageLogMap[path].enterPageTime.getTime();
		let t0 =
			pageLogMap[path].responseTime.getTime() -
			pageLogMap[path].enterPageTime.getTime();
		setTimeout(() => {
			let pvParams = {
				miniAppId: appConfig.miniAppId,
				miniAppName: appConfig.miniAppName,
				log_status: '02', //登录02 未登录01
				Page_duration: Page_duration / 1000 + '秒',
				t2: t2 / 1000 + '秒',
				t0: t0 / 1000 + '秒',
				pageId: path,
				pageName: getNavigationBarTitleText(),
			};
			zwlog.onReady(function() {
				console.log('------------埋点------------')
				console.log(zwlog.metaInfo)
				zwlog.sendPV(pvParams);
				delete pageLogMap[path];
			});
		}, 500);
	} else {
		let result = '';
		for (let k in pageLogMap[path]) {
			if (!pageLogMap[path][k]) result += k + '，';
		}
		console.warn('zheliban === 浙里办页面' + path + '埋点缺少参数=>>', result);
	}
}

// 点击事件的埋点
export const zwlogRecord = ({
	code = ''
} = {}) => {
	// if (!zwlog) initZwlog();
	if (!zwlog) return;
	let path = getCurRoute();
	zwlog.onReady(function() {
		zwlog.record({
			trackerEventCode: `${code}`,
			eventType: 'OTHER',
			eventParams: {
				pageId: path, //采用页面路径，也可以自己给每个页面设置一个pageId
				pageName: getNavigationBarTitleText(),
			},
		});
	});
}

export const zwlogMixin = {
	onShow() {
		if (!zwlog) return
		this.$zwlogPvGlobal({
			loadTime: new Date(),
			enterPageTime: new Date()
		});
		this.$nextTick(() => {
			this.$zwlogPvGlobal({
				responseTime: new Date()
			});
		});
	},
	onHide() {
		if (!zwlog) return
		this.$zwlogPvGlobal({
			leavePageTime: new Date()
		});
	}
}

// 获取页面的导航title
let getNavigationBarTitleText = () => {
	let pages = getCurrentPages();
	let page = pages[pages.length - 1];
	let title = page.$holder.navigationBarTitleText;
	console.log('zheliban === getNavigationBarTitleText title=', title);
	return title;
}

// 获取当前页面路由curRoute
let getCurRoute = () => {
	let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
	if (routes.length == 0) return
	let curRoute = routes[routes.length - 1].route; // 获取当前页面路由，也就是最后一个打开的页面路由
	console.log('curRoute', curRoute);
	return curRoute;
};
