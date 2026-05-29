<?php
namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function apply(Request $request)
    {
        $request->validate(['code' => 'required|string', 'subtotal' => 'required|numeric']);
        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon || !$coupon->isValid()) {
            return response()->json(['error' => 'Invalid or expired coupon.'], 422);
        }

        $alreadyUsed = $coupon->usages()->where('user_id', auth()->id())->exists();
        if ($alreadyUsed) {
            return response()->json(['error' => 'You have already used this coupon.'], 422);
        }

        $discount = $coupon->calculateDiscount($request->subtotal);
        if ($discount === 0) {
            return response()->json(['error' => "Minimum order amount is \${$coupon->min_order}."], 422);
        }

        return response()->json(['discount' => $discount, 'coupon' => $coupon]);
    }
}
