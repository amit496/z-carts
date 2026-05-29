<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Inertia\Inertia;

class AdminCouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::with('store')->latest()->paginate(20);
        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
            'stats' => [
                'total'  => Coupon::count(),
                'active' => Coupon::where('is_active', true)->count(),
                'used'   => Coupon::sum('used_count'),
            ],
        ]);
    }

    public function toggle(Coupon $coupon)
    {
        $coupon->update(['is_active' => !$coupon->is_active]);
        return back();
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return back()->with('success', 'Coupon deleted.');
    }
}
