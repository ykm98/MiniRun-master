/**
 * Notes: 陪替服务模块业务逻辑
 */

const BaseTaskService = require('./base_task_service.js');
const util = require('../../../framework/utils/util.js');
const FollowModel = require('../model/follow_model.js');
const UserModel = require('../model/user_model.js');

class FollowService extends BaseTaskService {

	constructor() {
		super(FollowModel, 'FOLLOW');
	}

	async acceptFollow(userId, id) {
		return await this.acceptTask(userId, id);
	}

	async cancelFollow(userId, id) {
		return await this.cancelTask(userId, id);
	}

	async statusFollow(userId, id, status) {
		return await this.statusTask(userId, id, status);
	}

	async delFollow(userId, id) {
		return await this.delTask(userId, id);
	}

	async insertFollow(userId, input) {
		return await this.insertTask(userId, input);
	}

	async editFollow(userId, input) {
		return await this.editTask(userId, input);
	}

	async updateFollowForms(input) {
		return await this.updateTaskForms(input);
	}

	async viewFollow(id) {
		let fields = '*';

		let where = {
			_id: id,
		}

		let follow = await FollowModel.getOne(where, fields);
		if (!follow) return null;

		if (follow.FOLLOW_STATUS > 0 && follow.FOLLOW_ACCEPT_USER_ID) {
			follow.acceptUser = await UserModel.getOne({ USER_MINI_OPENID: follow.FOLLOW_ACCEPT_USER_ID }, 'USER_NAME,USER_MOBILE');
		}

		FollowModel.inc(id, 'FOLLOW_VIEW_CNT', 1);

		return follow;
	}

	async getFollowDetail(id) {
		return await FollowModel.getOne(id);
	}

	async getFollowList(userId, {
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
			'FOLLOW_ORDER': 'asc',
			'FOLLOW_ADD_TIME': 'desc'
		};
		let fields = 'FOLLOW_ACCEPT_USER_ID,FOLLOW_END_TIME,FOLLOW_STATUS,FOLLOW_ADD_TIME,FOLLOW_USER_ID,FOLLOW_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId()
		};

		if (util.isDefined(search) && search) {
			if (search == '我的发布') {
				where.and.FOLLOW_USER_ID = userId;
			}
			else if (search == '我的接单') {
				where.and.FOLLOW_ACCEPT_USER_ID = userId;
			}
			else if (search == '我的收藏') {
				where.and.FOLLOW_FAV_LIST = userId;
			}
			else {
				where.or = [
					{ 'FOLLOW_OBJ.title': ['like', search] },
					{ 'FOLLOW_OBJ.poster': ['like', search] },
					{ 'FOLLOW_OBJ.tel': ['like', search] },
				];
			}
		} else if (sortType && util.isDefined(sortVal)) {
			switch (sortType) {
				case 'cateId': {
					where.and.FOLLOW_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.FOLLOW_STATUS = Number(sortVal);
					break;
				}
				case 'timeout': {
					where.and.FOLLOW_STATUS = 0;
					where.and.FOLLOW_END_TIME = ['<', this._timestamp]
					break;
				}
				case 'wait': {
					where.and.FOLLOW_STATUS = 0;
					where.and.FOLLOW_END_TIME = ['>=', this._timestamp]
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'FOLLOW_ADD_TIME');
					break;
				}
			}
		}

		return await FollowModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

}

module.exports = FollowService;
