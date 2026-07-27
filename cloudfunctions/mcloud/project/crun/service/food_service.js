/**
 * Notes: 代买服务模块业务逻辑
 */

const BaseTaskService = require('./base_task_service.js');
const util = require('../../../framework/utils/util.js');
const FoodModel = require('../model/food_model.js');
const UserModel = require('../model/user_model.js');

class FoodService extends BaseTaskService {

	constructor() {
		super(FoodModel, 'FOOD');
	}

	async acceptFood(userId, id) {
		return await this.acceptTask(userId, id);
	}

	async cancelFood(userId, id) {
		return await this.cancelTask(userId, id);
	}

	async statusFood(userId, id, status) {
		return await this.statusTask(userId, id, status);
	}

	async delFood(userId, id) {
		return await this.delTask(userId, id);
	}

	async insertFood(userId, input) {
		return await this.insertTask(userId, input);
	}

	async editFood(userId, input) {
		return await this.editTask(userId, input);
	}

	async updateFoodForms(input) {
		return await this.updateTaskForms(input);
	}

	async viewFood(id) {
		let fields = '*';

		let where = {
			_id: id,
		}

		let food = await FoodModel.getOne(where, fields);
		if (!food) return null;

		if (food.FOOD_STATUS > 0 && food.FOOD_ACCEPT_USER_ID) {
			food.acceptUser = await UserModel.getOne({ USER_MINI_OPENID: food.FOOD_ACCEPT_USER_ID }, 'USER_NAME,USER_MOBILE');
		}

		FoodModel.inc(id, 'FOOD_VIEW_CNT', 1);

		return food;
	}

	async getFoodDetail(id) {
		return await FoodModel.getOne(id);
	}

	async getFoodList(userId, {
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
			'FOOD_ORDER': 'asc',
			'FOOD_ADD_TIME': 'desc'
		};
		let fields = 'FOOD_ACCEPT_USER_ID,FOOD_END_TIME,FOOD_STATUS,FOOD_ADD_TIME,FOOD_USER_ID,FOOD_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId()
		};

		if (util.isDefined(search) && search) {
			if (search == '我的发布') {
				where.and.FOOD_USER_ID = userId;
			}
			else if (search == '我的接单') {
				where.and.FOOD_ACCEPT_USER_ID = userId;
			}
			else if (search == '我的收藏') {
				where.and.FOOD_FAV_LIST = userId;
			}
			else {
				where.or = [
					{ 'FOOD_OBJ.title': ['like', search] },
					{ 'FOOD_OBJ.poster': ['like', search] },
					{ 'FOOD_OBJ.tel': ['like', search] },
				];
			}
		} else if (sortType && util.isDefined(sortVal)) {
			switch (sortType) {
				case 'cateId': {
					where.and.FOOD_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.FOOD_STATUS = Number(sortVal);
					break;
				}
				case 'timeout': {
					where.and.FOOD_STATUS = 0;
					where.and.FOOD_END_TIME = ['<', this._timestamp]
					break;
				}
				case 'wait': {
					where.and.FOOD_STATUS = 0;
					where.and.FOOD_END_TIME = ['>=', this._timestamp]
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'FOOD_ADD_TIME');
					break;
				}
			}
		}

		return await FoodModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

}

module.exports = FoodService;
