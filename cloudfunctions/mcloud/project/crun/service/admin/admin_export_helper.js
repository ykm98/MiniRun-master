/**
 * Notes: 后台导出通用辅助
 */

const timeUtil = require('../../../../framework/utils/time_util.js');
const exportUtil = require('../../../../framework/utils/export_util.js');

function buildExportRows(list, fields, objKey, getExtra = null) {
	let header = ['序号'];
	for (let field of fields) {
		header.push(field.title);
	}
	if (getExtra) header = header.concat(getExtra.headers || []);

	let rows = [header];
	for (let k = 0; k < list.length; k++) {
		let item = list[k];
		let obj = item[objKey] || {};
		let row = [k + 1];
		for (let field of fields) {
			let val = obj[field.mark];
			if (val === undefined || val === null) val = '';
			row.push(val);
		}
		if (getExtra) row = row.concat(getExtra.values(item) || []);
		rows.push(row);
	}
	return rows;
}

function buildTimeWhere(prefix, start, end) {
	let where = {};
	if (start && end) {
		where[prefix + '_ADD_TIME'] = [
			['>=', timeUtil.time2Timestamp(start)],
			['<=', timeUtil.time2Timestamp(end + ' 23:59:59')]
		];
	} else if (start) {
		where[prefix + '_ADD_TIME'] = ['>=', timeUtil.time2Timestamp(start)];
	} else if (end) {
		where[prefix + '_ADD_TIME'] = ['<=', timeUtil.time2Timestamp(end + ' 23:59:59')];
	}
	return where;
}

async function exportTaskExcel({
	key,
	title,
	Model,
	prefix,
	objKey,
	fields,
	status,
	start,
	end,
}) {
	let where = {};
	if (status !== undefined && status !== null && status !== '' && Number(status) != 999) {
		where[prefix + '_STATUS'] = Number(status);
	}
	Object.assign(where, buildTimeWhere(prefix, start, end));

	let list = await Model.getAll(where, '*', { [prefix + '_ADD_TIME']: 'desc' }, 2000);
	let rows = buildExportRows(list, fields, objKey, {
		headers: ['状态', '发布时间'],
		values: (item) => [item[prefix + '_STATUS'], timeUtil.timestamp2Time(item[prefix + '_ADD_TIME'], 'Y-M-D h:m:s')]
	});

	return await exportUtil.exportDataExcel(key, title, list.length, rows);
}

async function exportUserExcel(key, condition, fields, UserModel) {
	let where = {};
	if (condition) {
		try {
			where = JSON.parse(decodeURIComponent(condition));
		} catch (e) {
			where = {};
		}
	}

	let list = await UserModel.getAll(where, '*', { USER_ADD_TIME: 'desc' }, 2000);
	let header = ['序号', '姓名', '手机'];
	for (let field of fields) header.push(field.title);
	header.push('状态', '注册时间');

	let rows = [header];
	for (let k = 0; k < list.length; k++) {
		let item = list[k];
		let row = [k + 1, item.USER_NAME || '', item.USER_MOBILE || ''];
		for (let field of fields) {
			let val = (item.USER_OBJ && item.USER_OBJ[field.mark]) || '';
			row.push(val);
		}
		row.push(item.USER_STATUS, timeUtil.timestamp2Time(item.USER_ADD_TIME, 'Y-M-D h:m:s'));
		rows.push(row);
	}

	return await exportUtil.exportDataExcel(key, '用户数据', list.length, rows);
}

module.exports = {
	exportTaskExcel,
	exportUserExcel,
};
