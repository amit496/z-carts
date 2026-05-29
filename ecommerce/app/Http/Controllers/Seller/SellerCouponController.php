<?php
namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerCouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::where('store_id', auth()->user()->store->id)->latest()->get();
        return Inertia::render('Seller/Coupons', ['coupons' => $coupons]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_order' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
        ]);

        Coupon::create([...$request->all(), 'store_id' => auth()->user()->store->id, 'code' => strtoupper($request->code)]);
        return back()->with('success', 'Coupon created!');
    }

    public function destroy(Coupon $coupon)
    {
        abort_if($coupon->store_id !== auth()->user()->store->id, 403);
        $coupon->delete();
        return back();
    }

    public function toggleActive(Coupon $coupon)
    {
        abort_if($coupon->store_id !== auth()->user()->store->id, 403);
        $coupon->update(['is_active' => !$coupon->is_active]);
        return back()->with('success', 'Coupon updated.');
    }
}
