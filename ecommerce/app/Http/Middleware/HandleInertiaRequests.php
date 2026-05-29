<?php

namespace App\Http\Middleware;

use App\Models\CartItem;
use App\Models\UserNotification;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'cartCount' => $user && Schema::hasTable('user_cart_items') && Schema::hasColumn('user_cart_items', 'user_id')
                ? (int) CartItem::where('user_id', $user->id)->sum('quantity')
                : 0,
            'wishlistCount' => $user && Schema::hasColumn('wishlists', 'user_id')
                ? Wishlist::where('user_id', $user->id)->count()
                : 0,
            'notifCount' => $user && Schema::hasTable('user_notifications')
                ? UserNotification::where('user_id', $user->id)->where('is_read', false)->count()
                : 0,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'delivery_partner_options' => collect(config('delivery_boys.partners', []))
                ->values()
                ->map(fn ($name, $idx) => ['id' => $idx + 1, 'name' => (string) $name])
                ->all(),
        ];
    }
}
