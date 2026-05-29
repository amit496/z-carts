<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    include 'admin/zcart_menu_aliases.php';

    // ── Dashboard ──────────────────────────────────────────────────────
    include 'admin/Dashboard.php';

    // ── Catalog ────────────────────────────────────────────────────────
    include 'admin/CategoryGroup.php';
    include 'admin/CategorySubGroup.php';
    include 'admin/Category.php';
    include 'admin/Categories.php';
    include 'admin/Catalog.php';
    include 'admin/Product.php';

    // ── Orders ─────────────────────────────────────────────────────────
    include 'admin/Order.php';
    include 'admin/Cart.php';

    // ── Vendors / Merchants ────────────────────────────────────────────
    include 'admin/Merchant.php';

    // ── Users ──────────────────────────────────────────────────────────
    include 'admin/User.php';

    // ── Promotions ─────────────────────────────────────────────────────
    include 'admin/Promos.php';
    include 'admin/Coupon.php';
    include 'admin/FlashDeal.php';

    // ── Support ────────────────────────────────────────────────────────
    include 'admin/Support.php';

    // ── Utility ────────────────────────────────────────────────────────
    include 'admin/Utility.php';

    // ── Reports ────────────────────────────────────────────────────────
    include 'admin/Report.php';

    // ── Settings / Config ──────────────────────────────────────────────
    include 'admin/Config.php';

    // ── Appearance ─────────────────────────────────────────────────────
    include 'admin/Appearance.php';

    // ── Wallet ─────────────────────────────────────────────────────────
    include 'admin/Wallet.php';

    // ── Reviews ────────────────────────────────────────────────────────
    include 'admin/Review.php';

    // ── Packages / Plugins ─────────────────────────────────────────────
    include 'admin/Package.php';
});
