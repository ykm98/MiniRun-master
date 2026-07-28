/**
 * Notes: 演示数据初始化
 * 首次云函数调用时自动写入，便于本地/演示环境展示
 */

const dbUtil = require('../../../framework/database/db_util.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const setupUtil = require('../../../framework/utils/setup/setup_util.js');
const UserModel = require('../model/user_model.js');
const NewsModel = require('../model/news_model.js');
const MailModel = require('../model/mail_model.js');
const FoodModel = require('../model/food_model.js');
const ThingModel = require('../model/thing_model.js');
const FollowModel = require('../model/follow_model.js');

const DEMO_MARKER = 'setup_crun_demo';
const SEED_KEY = 'DEMO_SEED_VERSION';
const SEED_VERSION = 4;
const CONST_PIC = '/images/cover.gif';

const DEMO_USERS = [
	{
		openid: 'demo_openid_10001',
		name: '张明',
		mobile: '13812345601',
		forms: [
			{ mark: 'sex', title: '性别', type: 'select', val: '男' },
			{ mark: 'college', title: '院系', type: 'text', val: '计算机学院' },
			{ mark: 'sub', title: '专业', type: 'text', val: '软件工程' },
			{ mark: 'address', title: '宿舍楼栋', type: 'text', val: '东区12栋308' },
		],
	},
	{
		openid: 'demo_openid_10002',
		name: '李娜',
		mobile: '13812345602',
		forms: [
			{ mark: 'sex', title: '性别', type: 'select', val: '女' },
			{ mark: 'college', title: '院系', type: 'text', val: '经济管理学院' },
			{ mark: 'sub', title: '专业', type: 'text', val: '金融学' },
			{ mark: 'address', title: '宿舍楼栋', type: 'text', val: '西区5栋201' },
		],
	},
	{
		openid: 'demo_openid_10003',
		name: '王浩',
		mobile: '13812345603',
		forms: [
			{ mark: 'sex', title: '性别', type: 'select', val: '男' },
			{ mark: 'college', title: '院系', type: 'text', val: '外国语学院' },
			{ mark: 'sub', title: '专业', type: 'text', val: '英语' },
			{ mark: 'address', title: '宿舍楼栋', type: 'text', val: '东区8栋502' },
		],
	},
	{
		openid: 'demo_openid_10004',
		name: '陈思雨',
		mobile: '13812345604',
		forms: [
			{ mark: 'sex', title: '性别', type: 'select', val: '女' },
			{ mark: 'college', title: '院系', type: 'text', val: '土木工程学院' },
			{ mark: 'sub', title: '专业', type: 'text', val: '工程造价' },
			{ mark: 'address', title: '宿舍楼栋', type: 'text', val: '南区3栋106' },
		],
	},
	{
		openid: 'demo_openid_10005',
		name: '刘子轩',
		mobile: '13812345605',
		forms: [
			{ mark: 'sex', title: '性别', type: 'select', val: '男' },
			{ mark: 'college', title: '院系', type: 'text', val: '信息工程学院' },
			{ mark: 'sub', title: '专业', type: 'text', val: '物联网工程' },
			{ mark: 'address', title: '宿舍楼栋', type: 'text', val: '东区15栋615' },
		],
	},
];

const DEMO_OPENIDS = DEMO_USERS.map((u) => u.openid).join(',');

function buildForms(defs) {
	return defs.map((item) => ({
		mark: item.mark,
		title: item.title,
		type: item.type,
		val: item.val,
	}));
}

function buildObj(forms) {
	return dataUtil.dbForms2Obj(forms);
}

function hoursAgo(hours) {
	return timeUtil.time() - hours * 3600 * 1000;
}

function daysLater(days) {
	return timeUtil.time() + days * 86400 * 1000;
}

async function seedUsers() {
	for (let user of DEMO_USERS) {
		let cnt = await UserModel.count({ USER_MINI_OPENID: user.openid });
		if (cnt > 0) continue;

		await UserModel.insert({
			USER_MINI_OPENID: user.openid,
			USER_NAME: user.name,
			USER_MOBILE: user.mobile,
			USER_PIC: '',
			USER_STATUS: 1,
			USER_FORMS: user.forms,
			USER_OBJ: buildObj(user.forms),
			USER_LOGIN_CNT: Math.floor(Math.random() * 20) + 3,
		});
	}
}

async function removePlaceholderNews() {
	let list = await NewsModel.getAll({}, 'NEWS_TITLE,_id');
	for (let item of list) {
		if (item.NEWS_TITLE && item.NEWS_TITLE.includes('标题1')) {
			await NewsModel.del(item._id);
		}
	}
}

async function seedNews() {
	await removePlaceholderNews();

	let newsList = [
		{
			NEWS_TITLE: '2025年秋季学期开学通知',
			NEWS_DESC: '请各位同学按时返校报到，关注选课与宿舍安排。',
			NEWS_CONTENT: [
				{ type: 'text', val: '各位同学：\n\n2025年秋季学期将于9月1日正式开学。请全体在校生于8月31日前完成返校报到，9月2日起按课表正常上课。\n\n注意事项：\n1. 新生请携带录取通知书及身份证到各学院报到点办理入学手续；\n2. 老生请提前在教务系统完成选课确认；\n3. 宿舍开放时间：8月28日8:00起。\n\n祝大家新学期顺利！' },
			],
			NEWS_VIEW_CNT: 326,
			NEWS_ADD_TIME: hoursAgo(72),
		},
		{
			NEWS_TITLE: '校园跑腿服务使用指南',
			NEWS_DESC: '快递代取、代买、急事代办、陪替服务发布与接单说明。',
			NEWS_CONTENT: [
				{ type: 'text', val: '欢迎使用校园跑腿小程序！\n\n【发布任务】在首页选择对应服务类型，填写需求详情和打赏金额后发布。\n\n【接单流程】浏览任务列表，点击「接单」即可承接，完成后请与发布者确认。\n\n【安全提示】请勿在平台外私下交易，遇到问题可联系平台管理员。' },
			],
			NEWS_VIEW_CNT: 189,
			NEWS_ADD_TIME: hoursAgo(48),
		},
		{
			NEWS_TITLE: '图书馆期末复习座位预约通知',
			NEWS_DESC: '期末考试周图书馆延长开放，部分阅览室实行预约制。',
			NEWS_CONTENT: [
				{ type: 'text', val: '期末考试周（1月6日—1月17日），图书馆开放时间调整为 7:00—23:00。\n\n三楼、四楼阅览室实行线上预约，每人每天可预约2个时段。请同学们文明自习，保持安静。' },
			],
			NEWS_VIEW_CNT: 412,
			NEWS_ADD_TIME: hoursAgo(24),
		},
		{
			NEWS_TITLE: '校园快递驿站营业时间调整',
			NEWS_DESC: '开学季各快递点延长营业，请合理安排取件时间。',
			NEWS_CONTENT: [
				{ type: 'text', val: '开学季期间（8月28日—9月10日），南门菜鸟驿站、东区快递服务中心营业时间调整为 8:00—21:00。\n\n高峰时段建议错峰取件，也可在小程序发布「快递代取」任务请同学帮忙。' },
			],
			NEWS_VIEW_CNT: 156,
			NEWS_ADD_TIME: hoursAgo(12),
		},
	];

	for (let news of newsList) {
		let exists = await NewsModel.count({ NEWS_TITLE: news.NEWS_TITLE });
		if (exists > 0) continue;

		await NewsModel.insert({
			NEWS_TITLE: news.NEWS_TITLE,
			NEWS_DESC: news.NEWS_DESC,
			NEWS_STATUS: 1,
			NEWS_CATE_ID: '1',
			NEWS_CATE_NAME: '通知公告',
			NEWS_CONTENT: news.NEWS_CONTENT,
			NEWS_PIC: [CONST_PIC],
			NEWS_VIEW_CNT: news.NEWS_VIEW_CNT,
			NEWS_ADD_TIME: news.NEWS_ADD_TIME,
			NEWS_EDIT_TIME: news.NEWS_ADD_TIME,
		});
	}
}

async function seedSetupContent() {
	await setupUtil.set('SETUP_CONTENT_ABOUT', [
		{ type: 'text', val: '校园跑腿是一款面向在校师生的互助服务平台，提供快递代取、代买服务、急事代办、陪替服务等校园生活帮助。\n\n我们致力于让校园生活更便捷，促进同学之间的互助与共享。' },
	], 'content');

	await setupUtil.set('SETUP_CONTENT_CONTACT', [
		{ type: 'text', val: '平台客服微信：campus-run-service\n服务时间：周一至周日 9:00—21:00\n如有问题请在小程序内留言，或联系所在学校管理员。' },
	], 'content');
}

async function seedMailTasks() {
	if (await MailModel.count({ MAIL_USER_ID: ['in', DEMO_OPENIDS] }) >= 4) return;

	const u = (i) => DEMO_USERS[i];

	let tasks = [
		{
			user: u(0),
			status: 0,
			endDays: 2,
			addHours: 2,
			forms: buildForms([
				{ mark: 'title', title: '快递名称', type: 'text', val: '顺丰快递' },
				{ mark: 'num', title: '快递件数', type: 'int', val: 1 },
				{ mark: 'weight', title: '预估重量(kg)', type: 'int', val: 2 },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 8 },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(0).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(0).mobile },
				{ mark: 'address1', title: '取件地址', type: 'textarea', val: '南门菜鸟驿站A区（近体育馆）' },
				{ mark: 'address2', title: '送货地址', type: 'textarea', val: '东区12栋308室' },
				{ mark: 'desc', title: '补充说明', type: 'textarea', val: '包裹不大，取件码已短信发送，麻烦送到宿舍楼下即可' },
				{ mark: 'code', title: '取件码', type: 'textarea', val: '8-4-2516' },
			]),
		},
		{
			user: u(1),
			status: 0,
			endDays: 1,
			addHours: 5,
			forms: buildForms([
				{ mark: 'title', title: '快递名称', type: 'text', val: '京东快递' },
				{ mark: 'num', title: '快递件数', type: 'int', val: 2 },
				{ mark: 'weight', title: '预估重量(kg)', type: 'int', val: 5 },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 12 },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(1).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(1).mobile },
				{ mark: 'address1', title: '取件地址', type: 'textarea', val: '北门快递柜3号柜' },
				{ mark: 'address2', title: '送货地址', type: 'textarea', val: '西区5栋201室' },
				{ mark: 'desc', title: '补充说明', type: 'textarea', val: '两个箱子，有点重，最好有小推车' },
				{ mark: 'code', title: '取件码', type: 'textarea', val: 'JD882910' },
			]),
		},
		{
			user: u(2),
			status: 1,
			endDays: 3,
			addHours: 18,
			acceptUser: u(4),
			forms: buildForms([
				{ mark: 'title', title: '快递名称', type: 'text', val: '中通快递' },
				{ mark: 'num', title: '快递件数', type: 'int', val: 1 },
				{ mark: 'weight', title: '预估重量(kg)', type: 'int', val: 1 },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 6 },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(2).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(2).mobile },
				{ mark: 'address1', title: '取件地址', type: 'textarea', val: '东区快递服务中心' },
				{ mark: 'address2', title: '送货地址', type: 'textarea', val: '东区8栋502室' },
				{ mark: 'code', title: '取件码', type: 'textarea', val: '6-2-0934' },
			]),
		},
		{
			user: u(3),
			status: 9,
			endDays: 1,
			addHours: 36,
			acceptUser: u(0),
			forms: buildForms([
				{ mark: 'title', title: '快递名称', type: 'text', val: '申通快递' },
				{ mark: 'num', title: '快递件数', type: 'int', val: 1 },
				{ mark: 'weight', title: '预估重量(kg)', type: 'int', val: 3 },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 5 },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(3).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(3).mobile },
				{ mark: 'address1', title: '取件地址', type: 'textarea', val: '生活区驿站（食堂旁）' },
				{ mark: 'address2', title: '送货地址', type: 'textarea', val: '南区3栋106室' },
				{ mark: 'code', title: '取件码', type: 'textarea', val: '3-1-7742' },
			]),
		},
	];

	for (let task of tasks) {
		let endTime = daysLater(task.endDays);
		let addTime = hoursAgo(task.addHours);
		let data = {
			MAIL_STATUS: task.status,
			MAIL_END_TIME: endTime,
			MAIL_CATE_ID: '1',
			MAIL_CATE_NAME: '快递代取',
			MAIL_USER_ID: task.user.openid,
			MAIL_USER_NAME: task.user.name,
			MAIL_FORMS: task.forms,
			MAIL_OBJ: buildObj(task.forms),
			MAIL_DAY: timeUtil.timestamp2Time(endTime, 'Y-M-D'),
			MAIL_ADD_TIME: addTime,
			MAIL_EDIT_TIME: addTime,
			MAIL_VIEW_CNT: Math.floor(Math.random() * 30) + 5,
		};

		if (task.acceptUser) {
			data.MAIL_ACCEPT_USER_ID = task.acceptUser.openid;
			data.MAIL_ACCEPT_USER_NAME = task.acceptUser.name;
			data.MAIL_ACCEPT_TIME = addTime + 3600 * 1000;
		}
		if (task.status === 9) {
			data.MAIL_OVER_TIME = addTime + 7200 * 1000;
		}

		await MailModel.insert(data);
	}
}

async function seedFoodTasks() {
	if (await FoodModel.count({ FOOD_USER_ID: ['in', DEMO_OPENIDS] }) >= 3) return;

	const u = (i) => DEMO_USERS[i];

	let tasks = [
		{
			user: u(0),
			status: 0,
			endDays: 1,
			addHours: 1,
			forms: buildForms([
				{ mark: 'title', title: '商品', type: 'text', val: '瑞幸咖啡2杯（生椰拿铁+美式）' },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 10 },
				{ mark: 'address1', title: '商家地址', type: 'textarea', val: '校园商业街瑞幸咖啡（图书馆店）' },
				{ mark: 'address2', title: '送货地址', type: 'textarea', val: '东区12栋308，放门口即可' },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(0).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(0).mobile },
				{ mark: 'desc', title: '详细描述', type: 'textarea', val: '少冰少糖，订单号已私信，下午3点前送到' },
			]),
		},
		{
			user: u(1),
			status: 0,
			endDays: 1,
			addHours: 3,
			forms: buildForms([
				{ mark: 'title', title: '商品', type: 'text', val: '第一食堂打包晚饭（一荤一素+米饭）' },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 8 },
				{ mark: 'address1', title: '商家地址', type: 'textarea', val: '第一食堂二楼窗口（麻辣烫旁边）' },
				{ mark: 'address2', title: '送货地址', type: 'textarea', val: '西区5栋201' },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(1).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(1).mobile },
				{ mark: 'desc', title: '详细描述', type: 'textarea', val: '不要香菜，6点左右送到，谢谢' },
			]),
		},
		{
			user: u(4),
			status: 1,
			endDays: 2,
			addHours: 8,
			acceptUser: u(2),
			forms: buildForms([
				{ mark: 'title', title: '商品', type: 'text', val: '校医院眼药水+润喉糖' },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 15 },
				{ mark: 'address1', title: '商家地址', type: 'textarea', val: '校医院一楼药房' },
				{ mark: 'address2', title: '送货地址', type: 'textarea', val: '东区15栋615' },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(4).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(4).mobile },
				{ mark: 'desc', title: '详细描述', type: 'textarea', val: '氯霉素滴眼液1瓶，金嗓子喉宝1盒' },
			]),
		},
	];

	for (let task of tasks) {
		let endTime = daysLater(task.endDays);
		let addTime = hoursAgo(task.addHours);
		let data = {
			FOOD_STATUS: task.status,
			FOOD_END_TIME: endTime,
			FOOD_CATE_ID: '1',
			FOOD_CATE_NAME: '代买服务',
			FOOD_USER_ID: task.user.openid,
			FOOD_USER_NAME: task.user.name,
			FOOD_FORMS: task.forms,
			FOOD_OBJ: buildObj(task.forms),
			FOOD_DAY: timeUtil.timestamp2Time(endTime, 'Y-M-D'),
			FOOD_ADD_TIME: addTime,
			FOOD_EDIT_TIME: addTime,
			FOOD_VIEW_CNT: Math.floor(Math.random() * 20) + 3,
		};

		if (task.acceptUser) {
			data.FOOD_ACCEPT_USER_ID = task.acceptUser.openid;
			data.FOOD_ACCEPT_USER_NAME = task.acceptUser.name;
			data.FOOD_ACCEPT_TIME = addTime + 1800 * 1000;
		}

		await FoodModel.insert(data);
	}
}

async function seedThingTasks() {
	if (await ThingModel.count({ THING_USER_ID: ['in', DEMO_OPENIDS] }) >= 3) return;

	const u = (i) => DEMO_USERS[i];

	let tasks = [
		{
			user: u(2),
			status: 0,
			endDays: 1,
			addHours: 4,
			forms: buildForms([
				{ mark: 'title', title: '代办事宜', type: 'text', val: '帮交实验报告到教务处' },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 20 },
				{ mark: 'level', title: '紧急程度', type: 'select', val: '紧急' },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(2).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(2).mobile },
				{ mark: 'desc', title: '详细描述', type: 'textarea', val: '报告已打印装订好，今天下午5点前交到行政楼203教务处，信封上写清学号姓名' },
			]),
		},
		{
			user: u(3),
			status: 0,
			endDays: 2,
			addHours: 10,
			forms: buildForms([
				{ mark: 'title', title: '代办事宜', type: 'text', val: '代还图书馆书籍3本' },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 12 },
				{ mark: 'level', title: '紧急程度', type: 'select', val: '一般' },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(3).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(3).mobile },
				{ mark: 'desc', title: '详细描述', type: 'textarea', val: '书在我宿舍，明天中午前还到图书馆一楼服务台即可，借阅卡照片已发' },
			]),
		},
		{
			user: u(0),
			status: 1,
			endDays: 1,
			addHours: 6,
			acceptUser: u(3),
			forms: buildForms([
				{ mark: 'title', title: '代办事宜', type: 'text', val: '帮忙送材料到行政楼综合办' },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 30 },
				{ mark: 'level', title: '紧急程度', type: 'select', val: '特急' },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(0).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(0).mobile },
				{ mark: 'desc', title: '详细描述', type: 'textarea', val: '奖学金申请材料，今天11点前送到行政楼105，很急！' },
			]),
		},
	];

	for (let task of tasks) {
		let endTime = daysLater(task.endDays);
		let addTime = hoursAgo(task.addHours);
		let data = {
			THING_STATUS: task.status,
			THING_END_TIME: endTime,
			THING_CATE_ID: '1',
			THING_CATE_NAME: '急事代办',
			THING_USER_ID: task.user.openid,
			THING_USER_NAME: task.user.name,
			THING_FORMS: task.forms,
			THING_OBJ: buildObj(task.forms),
			THING_DAY: timeUtil.timestamp2Time(endTime, 'Y-M-D'),
			THING_ADD_TIME: addTime,
			THING_EDIT_TIME: addTime,
			THING_VIEW_CNT: Math.floor(Math.random() * 25) + 4,
		};

		if (task.acceptUser) {
			data.THING_ACCEPT_USER_ID = task.acceptUser.openid;
			data.THING_ACCEPT_USER_NAME = task.acceptUser.name;
			data.THING_ACCEPT_TIME = addTime + 2400 * 1000;
		}

		await ThingModel.insert(data);
	}
}

async function seedFollowTasks() {
	if (await FollowModel.count({ FOLLOW_USER_ID: ['in', DEMO_OPENIDS] }) >= 3) return;

	const u = (i) => DEMO_USERS[i];

	let tasks = [
		{
			user: u(1),
			status: 0,
			endDays: 1,
			addHours: 7,
			forms: buildForms([
				{ mark: 'type', title: '服务类型', type: 'select', val: '替占座位' },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 15 },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(1).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(1).mobile },
				{ mark: 'desc', title: '详细描述', type: 'textarea', val: '明天上午高等数学课，帮占前排靠窗2个座位，教室在教学楼A302，8:00前到' },
			]),
		},
		{
			user: u(4),
			status: 0,
			endDays: 2,
			addHours: 14,
			forms: buildForms([
				{ mark: 'type', title: '服务类型', type: 'select', val: '替代排队' },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 20 },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(4).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(4).mobile },
				{ mark: 'desc', title: '详细描述', type: 'textarea', val: '周六上午四级模拟考报名排队，7:30到教务处一楼，帮我占个位置' },
			]),
		},
		{
			user: u(3),
			status: 9,
			endDays: 1,
			addHours: 30,
			acceptUser: u(1),
			forms: buildForms([
				{ mark: 'type', title: '服务类型', type: 'select', val: '行李搬运' },
				{ mark: 'price', title: '打赏金额(元)', type: 'digit', val: 25 },
				{ mark: 'poster', title: '联系人', type: 'text', val: u(3).name },
				{ mark: 'tel', title: '联系人电话', type: 'mobile', val: u(3).mobile },
				{ mark: 'desc', title: '详细描述', type: 'textarea', val: '开学行李从校门口搬到南区3栋106，一个行李箱+两个快递箱' },
			]),
		},
	];

	for (let task of tasks) {
		let endTime = daysLater(task.endDays);
		let addTime = hoursAgo(task.addHours);
		let data = {
			FOLLOW_STATUS: task.status,
			FOLLOW_END_TIME: endTime,
			FOLLOW_CATE_ID: '1',
			FOLLOW_CATE_NAME: '陪替服务',
			FOLLOW_USER_ID: task.user.openid,
			FOLLOW_USER_NAME: task.user.name,
			FOLLOW_FORMS: task.forms,
			FOLLOW_OBJ: buildObj(task.forms),
			FOLLOW_DAY: timeUtil.timestamp2Time(endTime, 'Y-M-D'),
			FOLLOW_ADD_TIME: addTime,
			FOLLOW_EDIT_TIME: addTime,
			FOLLOW_VIEW_CNT: Math.floor(Math.random() * 18) + 2,
		};

		if (task.acceptUser) {
			data.FOLLOW_ACCEPT_USER_ID = task.acceptUser.openid;
			data.FOLLOW_ACCEPT_USER_NAME = task.acceptUser.name;
			data.FOLLOW_ACCEPT_TIME = addTime + 3600 * 1000;
		}
		if (task.status === 9) {
			data.FOLLOW_OVER_TIME = addTime + 10800 * 1000;
		}

		await FollowModel.insert(data);
	}
}

async function isSeedComplete() {
	let version = await setupUtil.get(SEED_KEY);
	return version === SEED_VERSION;
}

async function ensureCollections() {
	// 集合由 initSetup 创建，此处跳过重复检测以节省时间
}

async function clearDemoData() {
	for (let user of DEMO_USERS) {
		await MailModel.del({ MAIL_USER_ID: user.openid });
		await FoodModel.del({ FOOD_USER_ID: user.openid });
		await ThingModel.del({ THING_USER_ID: user.openid });
		await FollowModel.del({ FOLLOW_USER_ID: user.openid });
		await UserModel.del({ USER_MINI_OPENID: user.openid });
	}

	await removePlaceholderNews();
	const demoNewsTitles = [
		'2025年秋季学期开学通知',
		'校园跑腿服务使用指南',
		'图书馆期末复习座位预约通知',
		'校园快递驿站营业时间调整',
	];
	for (let title of demoNewsTitles) {
		let list = await NewsModel.getAll({ NEWS_TITLE: title }, '_id');
		for (let item of list) {
			await NewsModel.del(item._id);
		}
	}

	await setupUtil.remove(SEED_KEY);
}

async function markSeedDone() {
	await setupUtil.set(SEED_KEY, SEED_VERSION, 'int');
}

async function seedDemoData(options = {}) {
	const { force = false } = options;

	if (!force && await isSeedComplete()) {
		return { seeded: false, reason: 'already_complete' };
	}

	console.log('### seedDemoData start, force=' + force);

	try {
		await ensureCollections();

		if (force) {
			await clearDemoData();
		}

		await seedUsers();
		await seedNews();
		await seedSetupContent();
		await seedMailTasks();
		await seedFoodTasks();
		await seedThingTasks();
		await seedFollowTasks();
		await markSeedDone();

		let F = (c) => 'bx_' + c;
		if (!await dbUtil.isExistCollection(F(DEMO_MARKER))) {
			await dbUtil.createCollection(F(DEMO_MARKER));
		}

		let summary = {
			seeded: true,
			users: await UserModel.count({ USER_MINI_OPENID: ['in', DEMO_OPENIDS] }),
			news: await NewsModel.count({}),
			mail: await MailModel.count({ MAIL_USER_ID: ['in', DEMO_OPENIDS] }),
			food: await FoodModel.count({ FOOD_USER_ID: ['in', DEMO_OPENIDS] }),
			thing: await ThingModel.count({ THING_USER_ID: ['in', DEMO_OPENIDS] }),
			follow: await FollowModel.count({ FOLLOW_USER_ID: ['in', DEMO_OPENIDS] }),
		};

		console.log('### seedDemoData done.', summary);
		return summary;
	} catch (err) {
		console.error('### seedDemoData failed:', err);
		throw err;
	}
}

module.exports = {
	seedDemoData,
	isSeedComplete,
};
