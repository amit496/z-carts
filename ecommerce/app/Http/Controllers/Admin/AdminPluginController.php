<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminPluginController extends Controller
{
    public function index()
    {
        $plugins = [
            ['name' => 'Affiliate System',    'desc' => 'Referral & affiliate commission tracking', 'status' => 'inactive', 'version' => '1.2.0', 'icon' => 'fa-handshake'],
            ['name' => 'Smart Search',        'desc' => 'AI-powered product search & suggestions',  'status' => 'inactive', 'version' => '2.0.1', 'icon' => 'fa-magnifying-glass'],
            ['name' => 'Wallet & Credits',    'desc' => 'Customer wallet and credit reward system',  'status' => 'inactive', 'version' => '1.0.5', 'icon' => 'fa-wallet'],
            ['name' => 'Google Analytics',    'desc' => 'Track storefront traffic and conversions',  'status' => 'inactive', 'version' => '3.1.0', 'icon' => 'fa-chart-line'],
            ['name' => 'Multi-language',      'desc' => 'Support multiple languages on storefront',  'status' => 'inactive', 'version' => '1.3.2', 'icon' => 'fa-language'],
            ['name' => 'Smart Forms',         'desc' => 'Custom form builder for lead generation',   'status' => 'inactive', 'version' => '1.1.0', 'icon' => 'fa-wpforms'],
            ['name' => 'Events Manager',      'desc' => 'Create and manage promotional events',      'status' => 'inactive', 'version' => '1.0.0', 'icon' => 'fa-calendar'],
            ['name' => 'Inspectables',        'desc' => 'Product inspection & quality control',      'status' => 'inactive', 'version' => '1.0.3', 'icon' => 'fa-magnifying-glass-chart'],
        ];
        return Inertia::render('Admin/Plugins/Index', ['plugins' => $plugins]);
    }
}
