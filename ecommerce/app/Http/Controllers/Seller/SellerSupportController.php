<?php
namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerSupportController extends Controller
{
    public function disputes()
    {
        $store = auth()->user()->store;

        $disputes = Order::with('user')
            ->where('store_id', $store->id)
            ->where('payment_status', 'unpaid')
            ->where('status', '!=', 'pending')
            ->latest()->paginate(15);

        return Inertia::render('Seller/Support/Disputes', [
            'disputes' => $disputes,
            'stats'    => [
                'total'    => Order::where('store_id', $store->id)->where('payment_status', 'unpaid')->where('status', '!=', 'pending')->count(),
                'refunded' => Order::where('store_id', $store->id)->where('payment_status', 'refunded')->count(),
            ],
        ]);
    }
}
