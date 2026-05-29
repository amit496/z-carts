<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'stats' => [
                'users'    => User::count(),
                'stores'   => Store::count(),
                'products' => Product::count(),
                'orders'   => Order::count(),
                'revenue'  => Order::where('payment_status', 'paid')->sum('total'),
            ],
        ]);
    }

    public function roles()
    {
        $roles = [
            ['name' => 'admin',  'label' => 'Administrator', 'count' => User::where('role', 'admin')->count(),  'color' => 'bg-red-100 text-red-700'],
            ['name' => 'seller', 'label' => 'Seller',        'count' => User::where('role', 'seller')->count(), 'color' => 'bg-blue-100 text-blue-700'],
            ['name' => 'buyer',  'label' => 'Buyer',         'count' => User::where('role', 'buyer')->count(),  'color' => 'bg-green-100 text-green-700'],
        ];
        return Inertia::render('Admin/Settings/Roles', ['roles' => $roles]);
    }

    public function system()
    {
        return Inertia::render('Admin/Settings/System', [
            'config' => [
                'app_name'    => config('app.name'),
                'app_env'     => config('app.env'),
                'app_debug'   => config('app.debug'),
                'db_driver'   => config('database.default'),
                'cache_driver'=> config('cache.default'),
                'queue_driver'=> config('queue.default'),
                'mail_mailer' => config('mail.default'),
                'php_version' => PHP_VERSION,
                'laravel_ver' => app()->version(),
            ],
        ]);
    }

    public function plans()
    {
        return Inertia::render('Admin/Settings/Plans', [
            'plans' => [
                ['name' => 'Free',       'price' => 0,   'products' => 10,  'commission' => 10, 'active' => true],
                ['name' => 'Basic',      'price' => 9,   'products' => 50,  'commission' => 8,  'active' => true],
                ['name' => 'Pro',        'price' => 29,  'products' => 200, 'commission' => 5,  'active' => true],
                ['name' => 'Enterprise', 'price' => 99,  'products' => -1,  'commission' => 3,  'active' => true],
            ],
        ]);
    }

    public function business()
    {
        return Inertia::render('Admin/Settings/Business', [
            'settings' => [
                'business_name'    => config('app.name'),
                'business_email'   => 'admin@zcart.com',
                'business_phone'   => '+1 555-0100',
                'business_address' => '123 Commerce St, New York, NY 10001',
                'business_country' => 'US',
                'timezone'         => 'America/New_York',
                'date_format'      => 'MM/DD/YYYY',
            ],
        ]);
    }

    public function languages()
    {
        return Inertia::render('Admin/Settings/Languages', [
            'languages' => [
                ['code' => 'en', 'name' => 'English',  'active' => true,  'default' => true],
                ['code' => 'es', 'name' => 'Spanish',  'active' => false, 'default' => false],
                ['code' => 'fr', 'name' => 'French',   'active' => false, 'default' => false],
                ['code' => 'de', 'name' => 'German',   'active' => false, 'default' => false],
                ['code' => 'ar', 'name' => 'Arabic',   'active' => false, 'default' => false],
                ['code' => 'hi', 'name' => 'Hindi',    'active' => false, 'default' => false],
                ['code' => 'ur', 'name' => 'Urdu',     'active' => false, 'default' => false],
                ['code' => 'zh', 'name' => 'Chinese',  'active' => false, 'default' => false],
            ],
        ]);
    }

    public function walletSettings()
    {
        return Inertia::render('Admin/Settings/WalletSettings', [
            'settings' => [
                'wallet_enabled'       => false,
                'min_withdrawal'       => 10,
                'max_withdrawal'       => 1000,
                'credit_per_dollar'    => 10,
                'referral_bonus'       => 5,
                'signup_bonus'         => 2,
            ],
        ]);
    }

    public function inspector()
    {
        return Inertia::render('Admin/Settings/Inspector', [
            'info' => 'Configure listing inspection / moderation when the Inspectables addon is enabled.',
        ]);
    }

    public function commissions()
    {
        return Inertia::render('Admin/Settings/Commissions', [
            'settings' => [
                'default_commission'   => 10,
                'min_commission'       => 3,
                'max_commission'       => 20,
                'commission_type'      => 'percentage',
            ],
        ]);
    }

    public function search()
    {
        return Inertia::render('Admin/Settings/Search', [
            'settings' => [
                'search_engine'        => 'default',
                'min_search_length'    => 2,
                'max_results'          => 20,
                'show_suggestions'     => true,
                'search_in_desc'       => false,
            ],
        ]);
    }
    public function config()
    {
        return Inertia::render('Admin/Settings/System', ['config' => ['app_name' => config('app.name'), 'app_env' => config('app.env'), 'app_debug' => config('app.debug'), 'db_driver' => config('database.default'), 'cache_driver' => config('cache.default'), 'queue_driver' => config('queue.default'), 'mail_mailer' => config('mail.default'), 'php_version' => PHP_VERSION, 'laravel_ver' => app()->version()]]);
    }

    public function currencies()
    {
        $currencies = [
            ['code' => 'USD', 'name' => 'US Dollar',      'symbol' => '$',  'active' => true],
            ['code' => 'EUR', 'name' => 'Euro',            'symbol' => '€',  'active' => false],
            ['code' => 'GBP', 'name' => 'British Pound',   'symbol' => '£',  'active' => false],
            ['code' => 'INR', 'name' => 'Indian Rupee',    'symbol' => '₹',  'active' => false],
            ['code' => 'PKR', 'name' => 'Pakistani Rupee', 'symbol' => '₨',  'active' => false],
        ];
        return Inertia::render('Admin/Settings/Currencies', ['currencies' => $currencies]);
    }
}
