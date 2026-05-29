<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Order;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSupportController extends Controller
{
    public function messages(Request $request)
    {
        $query = Chat::with(['buyer', 'store'])->withCount('messages')->orderByDesc('last_message_at');

        if ($request->filled('search')) {
            $s = '%'.trim((string) $request->input('search')).'%';
            $query->where(function ($q) use ($s) {
                $q->whereHas('buyer', fn ($b) => $b->where('name', 'like', $s)->orWhere('email', 'like', $s))
                    ->orWhereHas('store', fn ($st) => $st->where('name', 'like', $s));
            });
        }

        $chats = $query->paginate(25)->withQueryString();

        return Inertia::render('Admin/Support/Messages', [
            'chats'   => $chats,
            'filters' => $request->only('search'),
            'stats'   => ['total' => Chat::count(), 'today' => Chat::whereDate('last_message_at', today())->count()],
        ]);
    }

    // Tickets = cancelled orders needing attention
    public function tickets(Request $request)
    {
        $query = Order::with('user', 'store')
            ->where('status', 'cancelled')
            ->latest();

        if ($request->search) {
            $query->where('order_number', 'like', "%{$request->search}%")
                  ->orWhereHas('user', fn($q) => $q->where('name', 'like', "%{$request->search}%"));
        }

        $tickets = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Support/Tickets', [
            'tickets' => $tickets,
            'filters' => $request->only('search'),
            'stats'   => [
                'total'    => Order::where('status', 'cancelled')->count(),
                'refunded' => Order::where('payment_status', 'refunded')->count(),
            ],
        ]);
    }

    // Disputes = orders with payment issues
    public function disputes(Request $request)
    {
        $query = Order::with('user', 'store')
            ->where('payment_status', 'unpaid')
            ->where('status', '!=', 'pending')
            ->latest();

        $disputes = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Support/Disputes', [
            'disputes' => $disputes,
            'stats'    => [
                'total'   => Order::where('payment_status', 'unpaid')->where('status', '!=', 'pending')->count(),
                'unpaid'  => Order::where('payment_status', 'unpaid')->count(),
                'refunded'=> Order::where('payment_status', 'refunded')->count(),
            ],
        ]);
    }

    // Refunds = mark payment as refunded
    public function refunds(Request $request)
    {
        $refunds = Order::with('user', 'store')
            ->where('payment_status', 'refunded')
            ->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Support/Refunds', [
            'refunds' => $refunds,
            'stats'   => ['total' => Order::where('payment_status', 'refunded')->count()],
        ]);
    }

    public function processRefund(Request $request, Order $order)
    {
        $order->update(['payment_status' => 'refunded']);

        UserNotification::create([
            'user_id' => $order->user_id,
            'type'    => 'refund',
            'title'   => 'Refund Processed',
            'body'    => "Your order #{$order->order_number} has been refunded.",
            'data'    => ['order_id' => $order->id],
        ]);

        return back()->with('success', 'Refund processed.');
    }
}
