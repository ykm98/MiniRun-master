/**
 * Notes: 路由配置文件
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * User: CC
 * Date: 2020-10-14 07:00:00
 */

module.exports = {
	'test/test': 'test/test_controller@test',

	'home/setup_get': 'home_controller@getSetup',

	'passport/login': 'passport_controller@login',
	'passport/phone': 'passport_controller@getPhone',
	'passport/my_detail': 'passport_controller@getMyDetail',
	'passport/register': 'passport_controller@register',
	'passport/edit_base': 'passport_controller@editBase',

	// 收藏
	'fav/update': 'fav_controller@updateFav',
	'fav/del': 'fav_controller@delFav',
	'fav/is_fav': 'fav_controller@isFav',
	'fav/my_list': 'fav_controller@getMyFavList',

	'admin/home': 'admin/admin_home_controller@adminHome',
	'admin/seed_demo': 'admin/admin_home_controller@seedDemoData',
	'admin/clear_vouch': 'admin/admin_home_controller@clearVouchData',

	'admin/login': 'admin/admin_mgr_controller@adminLogin',
	'admin/mgr_list': 'admin/admin_mgr_controller@getMgrList',
	'admin/mgr_insert': 'admin/admin_mgr_controller@insertMgr',
	'admin/mgr_del': 'admin/admin_mgr_controller@delMgr',
	'admin/mgr_detail': 'admin/admin_mgr_controller@getMgrDetail',
	'admin/mgr_edit': 'admin/admin_mgr_controller@editMgr',
	'admin/mgr_status': 'admin/admin_mgr_controller@statusMgr',
	'admin/mgr_pwd': 'admin/admin_mgr_controller@pwdMgr',
	'admin/log_list': 'admin/admin_mgr_controller@getLogList',
	'admin/log_clear': 'admin/admin_mgr_controller@clearLog',

	'admin/setup_set': 'admin/admin_setup_controller@setSetup',
	'admin/setup_set_content': 'admin/admin_setup_controller@setContentSetup',
	'admin/setup_qr': 'admin/admin_setup_controller@genMiniQr',

	// 用户
	'admin/user_list': 'admin/admin_user_controller@getUserList',
	'admin/user_detail': 'admin/admin_user_controller@getUserDetail',
	'admin/user_del': 'admin/admin_user_controller@delUser',
	'admin/user_status': 'admin/admin_user_controller@statusUser',

	'admin/user_data_get': 'admin/admin_user_controller@userDataGet',
	'admin/user_data_export': 'admin/admin_user_controller@userDataExport',
	'admin/user_data_del': 'admin/admin_user_controller@userDataDel',


	// 内容  
	'home/list': 'home_controller@getHomeList',
	'news/list': 'news_controller@getNewsList',
	'news/view': 'news_controller@viewNews',

	'admin/news_list': 'admin/admin_news_controller@getAdminNewsList',
	'admin/news_insert': 'admin/admin_news_controller@insertNews',
	'admin/news_detail': 'admin/admin_news_controller@getNewsDetail',
	'admin/news_edit': 'admin/admin_news_controller@editNews',
	'admin/news_update_forms': 'admin/admin_news_controller@updateNewsForms',
	'admin/news_update_pic': 'admin/admin_news_controller@updateNewsPic',
	'admin/news_update_content': 'admin/admin_news_controller@updateNewsContent',
	'admin/news_del': 'admin/admin_news_controller@delNews',
	'admin/news_sort': 'admin/admin_news_controller@sortNews',
	'admin/news_status': 'admin/admin_news_controller@statusNews',



	// 快递代取
	'mail/list': 'mail_controller@getMailList',
	'mail/insert': 'mail_controller@insertMail',
	'mail/edit': 'mail_controller@editMail',
	'mail/status': 'mail_controller@statusMail',
	'mail/update_forms': 'mail_controller@updateMailForms',
	'mail/del': 'mail_controller@delMail',
	'mail/view': 'mail_controller@viewMail',
	'mail/accept': 'mail_controller@acceptMail',
	'mail/cancel': 'mail_controller@cancelMail',
	'mail/detail': 'mail_controller@getMailDetail',

	'admin/mail_detail': 'admin/admin_mail_controller@getAdminMailDetail',
	'admin/mail_list': 'admin/admin_mail_controller@getAdminMailList',
	'admin/mail_status': 'admin/admin_mail_controller@statusMail',
	'admin/mail_del': 'admin/admin_mail_controller@delMail',
	'admin/mail_sort': 'admin/admin_mail_controller@sortMail',
	'admin/mail_data_get': 'admin/admin_mail_controller@mailDataGet',
	'admin/mail_data_export': 'admin/admin_mail_controller@mailDataExport',
	'admin/mail_data_del': 'admin/admin_mail_controller@mailDataDel',

	// 急事代办
	'thing/list': 'thing_controller@getThingList',
	'thing/insert': 'thing_controller@insertThing',
	'thing/edit': 'thing_controller@editThing',
	'thing/status': 'thing_controller@statusThing',
	'thing/update_forms': 'thing_controller@updateThingForms',
	'thing/del': 'thing_controller@delThing',
	'thing/view': 'thing_controller@viewThing',
	'thing/accept': 'thing_controller@acceptThing',
	'thing/cancel': 'thing_controller@cancelThing',
	'thing/detail': 'thing_controller@getThingDetail',

	'admin/thing_detail': 'admin/admin_thing_controller@getAdminThingDetail',
	'admin/thing_list': 'admin/admin_thing_controller@getAdminThingList',
	'admin/thing_status': 'admin/admin_thing_controller@statusThing',
	'admin/thing_del': 'admin/admin_thing_controller@delThing',
	'admin/thing_sort': 'admin/admin_thing_controller@sortThing',
	'admin/thing_data_get': 'admin/admin_thing_controller@thingDataGet',
	'admin/thing_data_export': 'admin/admin_thing_controller@thingDataExport',
	'admin/thing_data_del': 'admin/admin_thing_controller@thingDataDel',

	// 外卖代取
	'food/list': 'food_controller@getFoodList',
	'food/insert': 'food_controller@insertFood',
	'food/edit': 'food_controller@editFood',
	'food/status': 'food_controller@statusFood',
	'food/update_forms': 'food_controller@updateFoodForms',
	'food/del': 'food_controller@delFood',
	'food/view': 'food_controller@viewFood',
	'food/accept': 'food_controller@acceptFood',
	'food/cancel': 'food_controller@cancelFood',
	'food/detail': 'food_controller@getFoodDetail',

	'admin/food_detail': 'admin/admin_food_controller@getAdminFoodDetail',
	'admin/food_list': 'admin/admin_food_controller@getAdminFoodList',
	'admin/food_status': 'admin/admin_food_controller@statusFood',
	'admin/food_del': 'admin/admin_food_controller@delFood',
	'admin/food_sort': 'admin/admin_food_controller@sortFood',
	'admin/food_data_get': 'admin/admin_food_controller@foodDataGet',
	'admin/food_data_export': 'admin/admin_food_controller@foodDataExport',
	'admin/food_data_del': 'admin/admin_food_controller@foodDataDel',

	// 陪替服务
	'follow/list': 'follow_controller@getFollowList',
	'follow/insert': 'follow_controller@insertFollow',
	'follow/edit': 'follow_controller@editFollow',
	'follow/status': 'follow_controller@statusFollow',
	'follow/update_forms': 'follow_controller@updateFollowForms',
	'follow/del': 'follow_controller@delFollow',
	'follow/view': 'follow_controller@viewFollow',
	'follow/accept': 'follow_controller@acceptFollow',
	'follow/cancel': 'follow_controller@cancelFollow',
	'follow/detail': 'follow_controller@getFollowDetail',

	'admin/follow_detail': 'admin/admin_follow_controller@getAdminFollowDetail',
	'admin/follow_list': 'admin/admin_follow_controller@getAdminFollowList',
	'admin/follow_status': 'admin/admin_follow_controller@statusFollow',
	'admin/follow_del': 'admin/admin_follow_controller@delFollow',
	'admin/follow_sort': 'admin/admin_follow_controller@sortFollow',
	'admin/follow_data_get': 'admin/admin_follow_controller@followDataGet',
	'admin/follow_data_export': 'admin/admin_follow_controller@followDataExport',
	'admin/follow_data_del': 'admin/admin_follow_controller@followDataDel',

}