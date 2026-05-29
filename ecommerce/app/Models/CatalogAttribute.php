<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CatalogAttribute extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'catalog_attribute_category');
    }

    public function values(): HasMany
    {
        return $this->hasMany(CatalogAttributeValue::class, 'catalog_attribute_id')
            ->orderBy('sort_order')
            ->orderBy('id');
    }
}
