/**
 * Notes: 快递代取模块业务逻辑
 */

const BaseTaskService = require('./base_task_service.js');
const util = require('../../../framework/utils/util.js');
const MailModel = require('../model/mail_model.js');
const UserModel = require('../model/user_model.js');

class MailService extends BaseTaskService {

	constructor() {
		super(MailModel, 'MAIL');
	}

	async acceptMail(userId, id) {
		return await this.acceptTask(userId, id);
	}

	async cancelMail(userId, id) {
		return await this.cancelTask(userId, id);
	}

	async statusMail(userId, id, status) {
		return await this.statusTask(userId, id, status);
	}

	async delMail(userId, id) {
		return await this.delTask(userId, id);
	}

	async insertMail(userId, input) {
		return await this.insertTask(userId, input);
	}

	async editMail(userId, input) {
		return await this.editTask(userId, input);
	}

	async updateMailForms(input) {
		return await this.updateTaskForms(input);
	}

	async viewMail(id) {
		let fields = '*';

		let where = {
			_id: id,
		}

		let mail = await MailModel.getOne(where, fields);
		if (!mail) return null;

		if (mail.MAIL_STATUS > 0 && mail.MAIL_ACCEPT_USER_ID) {
			mail.acceptUser = await UserModel.getOne({ USER_MINI_OPENID: mail.MAIL_ACCEPT_USER_ID }, 'USER_NAME,USER_MOBILE');
		}

		MailModel.inc(id, 'MAIL_VIEW_CNT', 1);

		return mail;
	}

	async getMailDetail(id) {
		return await MailModel.getOne(id);
	}

	async getMailList(userId, {
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
			'MAIL_ORDER': 'asc',
			'MAIL_ADD_TIME': 'desc'
		};
		let fields = 'MAIL_ACCEPT_USER_ID,MAIL_END_TIME,MAIL_STATUS,MAIL_ADD_TIME,MAIL_USER_ID,MAIL_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId()
		};

		if (util.isDefined(search) && search) {
			if (search == '我的发布') {
				where.and.MAIL_USER_ID = userId;
			}
			else if (search == '我的接单') {
				where.and.MAIL_ACCEPT_USER_ID = userId;
			}
			else if (search == '我的收藏') {
				where.and.MAIL_FAV_LIST = userId;
			}
			else {
				where.or = [
					{ 'MAIL_OBJ.title': ['like', search] },
					{ 'MAIL_OBJ.poster': ['like', search] },
					{ 'MAIL_OBJ.tel': ['like', search] },
				];
			}
		} else if (sortType && util.isDefined(sortVal)) {
			switch (sortType) {
				case 'cateId': {
					where.and.MAIL_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.MAIL_STATUS = Number(sortVal);
					break;
				}
				case 'timeout': {
					where.and.MAIL_STATUS = 0;
					where.and.MAIL_END_TIME = ['<', this._timestamp]
					break;
				}
				case 'wait': {
					where.and.MAIL_STATUS = 0;
					where.and.MAIL_END_TIME = ['>=', this._timestamp]
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'MAIL_ADD_TIME');
					break;
				}
			}
		}

		return await MailModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

}

module.exports = MailService;
