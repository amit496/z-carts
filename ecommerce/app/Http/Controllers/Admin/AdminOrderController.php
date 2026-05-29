<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\UserNotification;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\JsonResponse;

class AdminOrderController extends Controller
{
    /** @var list<string> */
    private const PAYMENT_VALUES = ['pending', 'paid', 'failed', 'refunded'];

    /** @var list<string> */
    private const ORDER_STATUS_VALUES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

    /** @var list<string> */
    private const FULFILLMENT_VALUES = ['standard', 'express', 'pickup', 'digital'];

    public function index(Request $request): InertiaResponse
    {
        $showArchived = $request->boolean('archived');

        $query = Order::with(['user', 'store', 'items'])
            ->orderByDesc('id');

        if ($showArchived) {
            $query->archived();
        } else {
            $query->notArchived();
        }

        if ($needle = trim((string) $request->search)) {
            $query->where(function ($q) use ($needle) {
                $q->where('order_number', 'like', "%{$needle}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$needle}%")
                        ->orWhere('email', 'like', "%{$needle}%"))
                    ->orWhereHas('store', fn ($s) => $s->where('name', 'like', "%{$needle}%"));
            });
        }

        $statusFilter = $request->query('status');
        if (is_string($statusFilter) && $statusFilter !== '' && $statusFilter !== 'all') {
            if (in_array($statusFilter, self::ORDER_STATUS_VALUES, true)) {
                $query->where('status', $statusFilter);
            }
        }

        $paymentFilter = $request->query('payment_status');
        if (is_string($paymentFilter) && $paymentFilter !== '' && $paymentFilter !== 'all') {
            if (in_array($paymentFilter, self::PAYMENT_VALUES, true)) {
                $query->where('payment_status', $paymentFilter);
            }
        }

        $fulfillment = $request->query('fulfillment');
        if (is_string($fulfillment) && $fulfillment !== '' && $fulfillment !== 'all') {
            if (in_array($fulfillment, self::FULFILLMENT_VALUES, true)) {
                $query->where('fulfillment_type', $fulfillment);
            }
        }

        $perPage = (int) $request->query('per_page', 10);
        if (! in_array($perPage, [10, 25, 50, 100], true)) {
            $perPage = 10;
        }

        $orders = $query->paginate($perPage)->withQueryString();

        $archivedPreview = ! $showArchived
            ? Order::with(['user', 'store'])->archived()->latest()->limit(12)->get()
            : collect();

        return Inertia::render('Admin/Orders/Index', [
            'orders'             => $orders,
            'archived_preview'   => $archivedPreview,
            'filters'            => [
                'search'          => $request->search ?? '',
                'status'          => $request->query('status', 'all'),
                'payment_status'  => $request->query('payment_status', 'all'),
                'fulfillment'     => $request->query('fulfillment', 'all'),
                'per_page'        => $perPage,
                'archived'        => $showArchived,
            ],
            'optionSets' => [
                'order_statuses' => self::ORDER_STATUS_VALUES,
                'payments'       => self::PAYMENT_VALUES,
                'fulfillment'    => self::FULFILLMENT_VALUES,
            ],
            'stats'              => [
                'total'         => Order::notArchived()->count(),
                'archived'      => Order::archived()->count(),
                'pending'       => Order::notArchived()->where('status', 'pending')->count(),
                'paid'          => Order::notArchived()->where('payment_status', 'paid')->count(),
                'revenue'       => Order::notArchived()->where('payment_status', 'paid')->sum('total'),
                'dispute_count' => Order::notArchived()->where('is_disputed', true)->count(),
            ],
        ]);
    }

    public function cancellations(Request $request): InertiaResponse
    {
        $orders = Order::with('user', 'store')
            ->where('status', 'cancelled')
            ->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Orders/Cancellations', [
            'orders' => $orders,
            'stats'  => [
                'total'          => Order::where('status', 'cancelled')->count(),
                'refunded'       => Order::where('status', 'cancelled')->where('payment_status', 'refunded')->count(),
                'pending_refund' => Order::where('status', 'cancelled')->where('payment_status', 'paid')->count(),
            ],
        ]);
    }

    public function bulkUpdate(Request $request)
    {
        $data = $request->validate([
            'ids'             => ['required', 'array', 'min:1'],
            'ids.*'           => ['integer', 'exists:orders,id'],
            'status'          => ['nullable', 'in:'.implode(',', self::ORDER_STATUS_VALUES)],
            'payment_status'  => ['nullable', 'in:'.implode(',', self::PAYMENT_VALUES)],
        ]);

        $ids = array_map('intval', $data['ids']);
        unset($data['ids']);

        $patch = [];
        if (! empty($data['status'])) {
            $patch['status'] = $data['status'];
        }
        if (! empty($data['payment_status'])) {
            $patch['payment_status'] = $data['payment_status'];
        }

        if ($patch === []) {
            return back()->with('error', 'Pick order status or payment status to assign.');
        }

        Order::query()->whereIn('id', $ids)->update($patch);

        return back()->with('success', 'Selected orders updated.');
    }

    public function archive(Order $order)
    {
        if ($order->archived_at) {
            $order->forceFill(['archived_at' => null])->save();
            $verb = 'restored';
        } else {
            $order->forceFill(['archived_at' => now()])->save();
            $verb = 'archived';
        }

        return back()->with('success', "Order {$verb}.");
    }

    public function assignDelivery(Request $request, Order $order)
    {
        $data = $request->validate([
            'delivery_partner' => ['nullable', 'string', 'max:128'],
        ]);
        $order->update(['delivery_partner' => $data['delivery_partner'] ?? null]);

        return back()->with('success', 'Delivery assignment saved.');
    }

    public function toggleDispute(Order $order)
    {
        $order->update(['is_disputed' => ! $order->is_disputed]);

        return back()->with('success', $order->fresh()->is_disputed ? 'Marked as disputed.' : 'Dispute flag cleared.');
    }

    /**
     * Printable HTML invoice (default) or `?format=csv` for spreadsheet export.
     */
    public function invoice(Request $request, Order $order): StreamedResponse|HttpResponse
    {
        $order->load(['user', 'store', 'items.product']);

        if ($request->query('format') === 'csv') {
            return $this->invoiceCsv($order);
        }

        $fromName = $order->store?->name ?? (string) config('app.name', 'zCart');
        $fromAddress = (string) config('invoice.from_address');
        $customerName = $order->user?->name ?? 'Guest customer';

        $sub = (float) $order->subtotal;
        $disc = (float) $order->discount;
        $ship = (float) $order->shipping;
        $tot = (float) $order->total;
        $rest = $tot - ($sub - $disc + $ship);
        $taxAmount = abs($rest) < 0.02 ? 0.0 : max(0, round($rest, 2));

        $paymentMethodLabel = $order->payment_method
            ? (string) $order->payment_method
            : '—';

        $slug = Str::slug($order->order_number, '-');
        $filename = 'invoice-'.($slug !== '' ? $slug : (string) $order->id).'.html';

        return response()
            ->view('admin.orders.invoice', [
                'order' => $order,
                'fromName' => $fromName,
                'fromAddress' => $fromAddress,
                'customerName' => $customerName,
                'taxAmount' => $taxAmount,
                'paymentMethodLabel' => $paymentMethodLabel,
            ])
            ->header('Content-Type', 'text/html; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="'.$filename.'"');
    }

    /** CSV download suitable for Excel import */
    private function invoiceCsv(Order $order): StreamedResponse
    {
        $lines = [];
        $lines[] = 'Field,Value';
        $lines[] = 'Order,'.$order->order_number;
        $lines[] = 'Date,'.$order->created_at?->format('Y-m-d H:i:s');
        $lines[] = 'Customer,'.'"'.str_replace('"', '""', (string) ($order->user?->name ?? '')).'"';
        $lines[] = 'Email,'.'"'.str_replace('"', '""', (string) ($order->user?->email ?? '')).'"';
        $lines[] = 'Store,'.'"'.str_replace('"', '""', (string) ($order->store?->name ?? '')).'"';
        $lines[] = 'Payment,'.$order->payment_status;
        $lines[] = 'Status,'.$order->status;
        $lines[] = 'Total,'.$order->total;
        $lines[] = '';
        $lines[] = 'SKU / Product,Qty,Unit price,Line total';
        foreach ($order->items as $item) {
            $name = str_replace('"', '""', (string) $item->product_name);
            $lines[] = '"'.$name.'",'.$item->quantity.','.$item->price.','.(($item->price ?? 0) * ($item->quantity ?? 0));
        }

        $body = implode("\n", $lines);

        return response()->streamDownload(
            static function () use ($body) {
                echo $body;
            },
            'order-'.$order->order_number.'.csv',
            ['Content-Type' => 'text/csv; charset=UTF-8'],
        );
    }

    /**
     * Full order page (Inertia) or JSON for `fetch(..., Accept: application/json)` from the orders table.
     */
    public function show(Request $request, Order $order): InertiaResponse|JsonResponse
    {
        $order->load(['user', 'store', 'items.product.images', 'coupon']);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json($order);
        }

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'optionSets' => [
                'order_statuses' => self::ORDER_STATUS_VALUES,
                'payments'       => self::PAYMENT_VALUES,
                'fulfillment'    => self::FULFILLMENT_VALUES,
            ],
        ]);
    }

    public function update(Request $request, Order $order)
    {
        if (! $request->hasAny(['status', 'payment_status', 'tracking_number', 'fulfillment_type'])) {
            return back()->with('error', 'Nothing to update.');
        }

        $validated = $request->validate([
            'status'            => ['sometimes', 'in:'.implode(',', self::ORDER_STATUS_VALUES)],
            'payment_status'    => ['sometimes', 'in:'.implode(',', self::PAYMENT_VALUES)],
            'tracking_number'   => ['sometimes', 'nullable', 'string', 'max:191'],
            'fulfillment_type'  => ['sometimes', 'nullable', 'in:'.implode(',', self::FULFILLMENT_VALUES)],
        ]);

        $order->update(collect($validated)->filter(static fn ($v) => $v !== null && $v !== '')->all());

        UserNotification::create([
            'user_id' => $order->user_id,
            'type'    => 'order_status',
            'title'   => 'Order updated',
            'body'    => "Your order #{$order->order_number} was updated.",
            'data'    => ['order_id' => $order->id],
        ]);

        return back()->with('success', 'Order updated successfully.');
    }
}
