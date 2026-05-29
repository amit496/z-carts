<?php

namespace App\Models;

/**
 * Inertia / seller layer uses "Store"; zCart DB table is {@see Shop::$table shops}.
 *
 * Eloquent defaults child FK to "{basename}_id" → would be store_id; DB columns use shop_id.
 */
class Store extends Shop
{
    public function getForeignKey(): string
    {
        return 'shop_id';
    }

    /**
     * Admin/Inertia expects `user`; zCart uses {@see owner()} on shops.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'owner_id')->withTrashed();
    }
}
