/**
 * Notes: 急事代办模块业务逻辑
 */

const BaseTaskService = require('./base_task_service.js');
const util = require('../../../framework/utils/util.js');
const ThingModel = require('../model/thing_model.js');
const UserModel = require('../model/user_model.js');

class ThingService extends BaseTaskService {

	constructor() {
		super(ThingModel, 'THING');
	}

	async acceptThing(userId, id) {
		return await this.acceptTask(userId, id);
	}

	async cancelThing(userId, id) {
		return await this.cancelTask(userId, id);
	}

	async statusThing(userId, id, status) {
		return await this.statusTask(userId, id, status);
	}

	async delThing(userId, id) {
		return await this.delTask(userId, id);
	}

	async insertThing(userId, input) {
		return await this.insertTask(userId, input);
	}

	async editThing(userId, input) {
		return await this.editTask(userId, input);
	}

	async updateThingForms(input) {
		return await this.updateTaskForms(input);
	}

	async viewThing(id) {
		let fields = '*';

		let where = {
			_id: id,
		}

		let thing = await ThingModel.getOne(where, fields);
		if (!thing) return null;

		if (thing.THING_STATUS > 0 && thing.THING_ACCEPT_USER_ID) {
			thing.acceptUser = await UserModel.getOne({ USER_MINI_OPENID: thing.THING_ACCEPT_USER_ID }, 'USER_NAME,USER_MOBILE');
		}

		ThingModel.inc(id, 'THING_VIEW_CNT', 1);

		return thing;
	}

	async getThingDetail(id) {
		return await ThingModel.getOne(id);
	}

	async getThingList(userId, {
		search,
		sortType,
		sortVal,
		orderBy,
		whereEx,
		page,
		size,
		isTotal = true,
		oldTotal }) {
		orderBy = orderBy || {
			'THING_ORDER': 'asc',
			'THING_ADD_TIME': 'desc'
		};
		let fields = 'THING_ACCEPT_USER_ID,THING_END_TIME,THING_STATUS,THING_ADD_TIME,THING_USER_ID,THING_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId()
		};

		if (util.isDefined(search) && search) {
			if (search == '我的发布') {
				where.and.THING_USER_ID = userId;
			}
			else if (search == '我的接单') {
				where.and.THING_ACCEPT_USER_ID = userId;
			}
			else if (search == '我的收藏') {
				where.and.THING_FAV_LIST = userId;
			}
			else {
				where.or = [
					{ 'THING_OBJ.title': ['like', search] },
					{ 'THING_OBJ.poster': ['like', search] },
					{ 'THING_OBJ.tel': ['like', search] },
				];
			}
		} else if (sortType && util.isDefined(sortVal)) {
			switch (sortType) {
				case 'cateId': {
					where.and.THING_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.THING_STATUS = Number(sortVal);
					break;
				}
				case 'timeout': {
					where.and.THING_STATUS = 0;
					where.and.THING_END_TIME = ['<', this._timestamp]
					break;
				}
				case 'wait': {
					where.and.THING_STATUS = 0;
					where.and.THING_END_TIME = ['>=', this._timestamp]
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'THING_ADD_TIME');
					break;
				}
			}
		}

		return await ThingModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

}

module.exports = ThingService;
