/**
 * Notes: 跑腿任务通用业务逻辑
 */

const BaseProjectService = require('./base_project_service.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const UserModel = require('../model/user_model.js');

class BaseTaskService extends BaseProjectService {

	constructor(TaskModel, prefix) {
		super();
		this.TaskModel = TaskModel;
		this.PREFIX = prefix;
	}

	_field(name) {
		return this.PREFIX + '_' + name;
	}

	getStatusDesc(item) {
		const status = item[this._field('STATUS')];
		const endTime = item[this._field('END_TIME')];

		if (status === 9) return '已完成';
		if (status === 1) return '已接单';
		if (status === 0) {
			if (endTime && endTime < this._timestamp) return '已过期';
			return '待接单';
		}
		return '待接单';
	}

	async _getTask(id) {
		let task = await this.TaskModel.getOne(id);
		if (!task) this.AppError('记录不存在');
		return task;
	}

	async _getUserName(userId) {
		let user = await UserModel.getOne({ USER_MINI_OPENID: userId }, 'USER_NAME');
		return user ? user.USER_NAME : '';
	}

	async acceptTask(userId, id) {
		let task = await this._getTask(id);

		if (task[this._field('USER_ID')] === userId) this.AppError('不能接自己发布的单');
		if (task[this._field('STATUS')] !== 0) this.AppError('该单已被接单或已完成');
		if (task[this._field('END_TIME')] && task[this._field('END_TIME')] < this._timestamp) {
			this.AppError('该单已过期');
		}

		let userName = await this._getUserName(userId);
		let data = {
			[this._field('ACCEPT_USER_ID')]: userId,
			[this._field('ACCEPT_USER_NAME')]: userName,
			[this._field('ACCEPT_TIME')]: this._timestamp,
			[this._field('STATUS')]: 1,
		};

		await this.TaskModel.edit(id, data);
		return { statusDesc: this.getStatusDesc(Object.assign({}, task, data)) };
	}

	async cancelTask(userId, id) {
		let task = await this._getTask(id);

		if (task[this._field('ACCEPT_USER_ID')] !== userId) this.AppError('仅接单人可取消');
		if (task[this._field('STATUS')] !== 1) this.AppError('当前状态不可取消');

		let data = {
			[this._field('ACCEPT_USER_ID')]: '',
			[this._field('ACCEPT_USER_NAME')]: '',
			[this._field('ACCEPT_TIME')]: 0,
			[this._field('STATUS')]: 0,
		};

		await this.TaskModel.edit(id, data);
		return { statusDesc: this.getStatusDesc(Object.assign({}, task, data)) };
	}

	async statusTask(userId, id, status) {
		let task = await this._getTask(id);
		status = Number(status);

		if (userId && task[this._field('USER_ID')] !== userId) {
			this.AppError('仅发布人可修改状态');
		}

		let data = {
			[this._field('STATUS')]: status,
		};

		if (status === 9) {
			data[this._field('OVER_TIME')] = this._timestamp;
		} else if (status === 0) {
			data[this._field('OVER_TIME')] = 0;
		}

		await this.TaskModel.edit(id, data);
		return { statusDesc: this.getStatusDesc(Object.assign({}, task, data)) };
	}

	async delTask(userId, id) {
		let task = await this._getTask(id);

		if (userId && task[this._field('USER_ID')] !== userId) {
			this.AppError('仅发布人可删除');
		}

		await this.TaskModel.del(id);
	}

	async insertTask(userId, { cateId, cateName, order, end, forms }) {
		if (!end) this.AppError('接单截止时间不能为空');
		if (!forms || !Array.isArray(forms)) this.AppError('表单数据不能为空');

		let endTime = timeUtil.time2Timestamp(end);
		if (endTime <= this._timestamp) this.AppError('接单截止时间必须大于当前时间');

		let userName = await this._getUserName(userId);
		let data = {
			[this._field('CATE_ID')]: String(cateId),
			[this._field('CATE_NAME')]: cateName,
			[this._field('ORDER')]: Number(order) || 9999,
			[this._field('END_TIME')]: endTime,
			[this._field('USER_ID')]: userId,
			[this._field('USER_NAME')]: userName,
			[this._field('STATUS')]: 0,
			[this._field('FORMS')]: forms,
			[this._field('OBJ')]: dataUtil.dbForms2Obj(forms),
			[this._field('DAY')]: timeUtil.timestamp2Time(endTime, 'Y-M-D'),
		};

		let id = await this.TaskModel.insert(data);
		return { id };
	}

	async editTask(userId, { id, cateId, cateName, order, end, forms }) {
		let task = await this._getTask(id);

		if (task[this._field('USER_ID')] !== userId) this.AppError('仅发布人可修改');
		if (task[this._field('STATUS')] !== 0) this.AppError('已接单或已完成，不可修改');

		let endTime = timeUtil.time2Timestamp(end);
		if (endTime <= this._timestamp) this.AppError('接单截止时间必须大于当前时间');

		let data = {
			[this._field('CATE_ID')]: String(cateId),
			[this._field('CATE_NAME')]: cateName,
			[this._field('ORDER')]: Number(order) || 9999,
			[this._field('END_TIME')]: endTime,
			[this._field('FORMS')]: forms,
			[this._field('OBJ')]: dataUtil.dbForms2Obj(forms),
			[this._field('DAY')]: timeUtil.timestamp2Time(endTime, 'Y-M-D'),
		};

		await this.TaskModel.edit(id, data);
		return { statusDesc: this.getStatusDesc(Object.assign({}, task, data)) };
	}

	async updateTaskForms({ id, hasImageForms }) {
		await this._getTask(id);
		await this.TaskModel.editForms(id, this._field('FORMS'), this._field('OBJ'), hasImageForms);
	}

}

module.exports = BaseTaskService;
