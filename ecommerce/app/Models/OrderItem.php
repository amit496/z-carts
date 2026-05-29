<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class OrderItem extends Pivot
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'order_items';

    protected $fillable = [
        'order_id',
        'inventory_id',
        'item_description',
        'quantity',
        'unit_price',
        'feedback_id',
        'download',
        'product_id',
        'variant_id',
        'product_name',
        'size',
        'color',
        'price',
    ];

    /**
     * Get the Inventory associated with the model.
     */
    public function inventory()
    {
        return $this->belongsTo(Inventory::class, 'inventory_id');
    }

    /**
     * Get the order associated with the model.
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
