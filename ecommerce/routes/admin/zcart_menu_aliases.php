<?php

/**
 * zCart-style admin URLs → existing app routes (sidebar + bookmarks compatibility).
 */
use Illuminate\Support\Facades\Route;

foreach ([
    ['catalog/product', '/admin/products'],
    ['catalog/product/create', '/admin/products/create'],
    ['catalog/manufacturer', '/admin/catalog/manufacturers'],
    ['catalog/attribute', '/admin/catalog/attributes'],
    ['support/ticket', '/admin/support/tickets'],
    ['appearance/popup', '/admin/appearance/popups'],
    ['order/order', '/admin/orders'],
    ['order/cart', '/admin/carts'],
    ['order/cancellation', '/admin/orders/cancellations'],
    ['admin/user', '/admin/users'],
    ['admin/customer', '/admin/users/customers'],
    ['affiliate', '/admin/users/affiliates'],
    ['inspector/inspectables', '/admin/users/sellers'],
    ['seller/merchant', '/admin/stores'],
    ['seller/shop', '/admin/stores/approved'],
    ['rewards', '/admin/wallet/credits'],
    ['affiliate/commissions', '/admin/wallet/commission'],
    ['payouts', '/admin/wallet'],
    ['payout/requests', '/admin/wallet/payout-requests'],
    ['wallet/bulkupload/index', '/admin/wallet/deposits'],
    ['appearance/theme', '/admin/appearance/themes'],
    ['appearance/slider', '/admin/appearance/sliders'],
    ['appearance/custom_css', '/admin/appearance/custom-css'],
    ['flashdeal', '/admin/flash-sales'],
    ['promotions/trendingKeywords', '/admin/promotions/trending'],
    ['packages', '/admin/plugins'],
    ['setting/subscriptionPlan', '/admin/settings/plans'],
    ['setting/role', '/admin/settings/roles'],
    ['setting/system/general', '/admin/settings/system'],
    ['setting/system/config', '/admin/settings/system/config'],
    ['setting/country', '/admin/settings/business'],
    ['setting/currency', '/admin/settings/currencies'],
    ['setting/language', '/admin/settings/languages'],
    ['setting/wallet', '/admin/settings/wallet-settings'],
    ['setting/inspector', '/admin/settings/inspector'],
    ['setting/dynamicCommission', '/admin/settings/commissions'],
    ['setting/autocomplete', '/admin/settings/search'],
    ['utility/emailTemplate', '/admin/utilities/email-templates'],
    ['utility/pdfTemplate', '/admin/utilities/pdf-templates'],
    ['utility/smartForm', '/admin/utilities/smart-forms'],
    ['utility/page', '/admin/utilities/pages'],
    ['utility/blog', '/admin/utilities/blogs'],
    ['utility/event', '/admin/utilities/events'],
    ['utility/faq', '/admin/utilities/faqs'],
    ['report/payout', '/admin/reports/payouts'],
    ['report/kpi', '/admin/reports/performance'],
    ['report/googleAnalytics', '/admin/reports/analytics'],
] as [$from, $to]) {
    Route::redirect($from, $to);
}

Route::redirect('support/message/labelOf', '/admin/support/messages');
Route::redirect('support/message/labelOf/{label}', '/admin/support/messages')->where('label', '[0-9]+');
