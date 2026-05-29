@php
    $paymentStatusDisplay = match ($order->payment_status) {
        'pending' => 'UNPAID',
        'failed' => 'FAILED',
        'paid' => 'PAID',
        'refunded' => 'REFUNDED',
        default => strtoupper((string) $order->payment_status),
    };
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invoice — Order #{{ $order->order_number }}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 32px 40px 48px;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.45;
            color: #111;
            background: #fff;
        }
        .inv-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 28px;
        }
        .inv-header strong { font-size: 15px; }
        .inv-two {
            display: flex;
            justify-content: space-between;
            gap: 32px;
            margin-bottom: 28px;
        }
        .inv-block { flex: 1; min-width: 0; }
        .inv-label {
            display: inline-block;
            font-size: 13px;
            font-weight: 600;
            text-decoration: underline;
            margin-bottom: 8px;
        }
        .from-name {
            font-size: 17px;
            font-weight: 700;
            margin-bottom: 6px;
        }
        .cust-name { font-size: 15px; font-weight: 700; }
        .inv-title {
            text-align: center;
            font-size: 15px;
            font-weight: 700;
            text-decoration: underline;
            margin: 8px 0 12px;
        }
        table.inv-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ccc;
        }
        table.inv-table th,
        table.inv-table td {
            border: 1px solid #d4d4d4;
            padding: 10px 12px;
            vertical-align: top;
        }
        table.inv-table thead th {
            background: #f2f2f2;
            font-weight: 600;
            text-align: left;
        }
        table.inv-table .col-qty { text-align: center; width: 100px; }
        table.inv-table .col-price { text-align: right; width: 120px; }
        table.inv-table tbody td.col-price { font-variant-numeric: tabular-nums; }
        .summary-row td {
            background: #f2f2f2;
            font-weight: 600;
        }
        .summary-row td:last-child {
            text-align: right;
            font-variant-numeric: tabular-nums;
        }
        .summary-label { text-align: left !important; }
        .pay-block {
            margin-top: 28px;
            max-width: 360px;
        }
        .pay-block p { margin: 0 0 6px; }
        .pay-block .k { font-weight: 600; }
        @media print {
            body { padding: 24px 32px 32px; }
        }
    </style>
</head>
<body>
    <header class="inv-header">
        <div><strong>Order: #{{ $order->order_number }}</strong></div>
        <div><strong>Order date: {{ $order->created_at?->format('d/m/y') }}</strong></div>
    </header>

    <div class="inv-two">
        <div class="inv-block">
            <span class="inv-label">From</span>
            <div class="from-name">{{ $fromName }}</div>
            <div>{{ $fromAddress }}</div>
        </div>
        <div class="inv-block" style="text-align: right;">
            <span class="inv-label">Customer</span>
            <div class="cust-name">{{ $customerName }}</div>
        </div>
    </div>

    <div class="inv-title">Order Details</div>

    <table class="inv-table" role="table">
        <thead>
            <tr>
                <th>Product</th>
                <th class="col-qty">Quantity</th>
                <th class="col-price">Price</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->items as $item)
                @php
                    $line = (float) ($item->price ?? 0) * (int) ($item->quantity ?? 0);
                @endphp
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td class="col-qty">{{ (int) ($item->quantity ?? 0) }}</td>
                    <td class="col-price">${{ number_format($line, 2) }}</td>
                </tr>
            @endforeach
            <tr class="summary-row">
                <td colspan="2" class="summary-label">Total</td>
                <td class="col-price">${{ number_format((float) $order->subtotal, 2) }}</td>
            </tr>
            @if ((float) $order->discount > 0)
                <tr class="summary-row">
                    <td colspan="2" class="summary-label">Discount</td>
                    <td class="col-price">−${{ number_format((float) $order->discount, 2) }}</td>
                </tr>
            @endif
            <tr class="summary-row">
                <td colspan="2" class="summary-label">Tax</td>
                <td class="col-price">${{ number_format($taxAmount, 2) }}</td>
            </tr>
            <tr class="summary-row">
                <td colspan="2" class="summary-label">Shipping</td>
                <td class="col-price">${{ number_format((float) $order->shipping, 2) }}</td>
            </tr>
            <tr class="summary-row">
                <td colspan="2" class="summary-label">Grand total</td>
                <td class="col-price">${{ number_format((float) $order->total, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="pay-block">
        <p><span class="k">Payment status:</span> {{ $paymentStatusDisplay }}</p>
        <p><span class="k">Payment method:</span> {{ $paymentMethodLabel }}</p>
    </div>
</body>
</html>
