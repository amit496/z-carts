<?php

namespace App\Models;

use App\Common\CascadeSoftDeletes;
use App\Common\Feedbackable;
use App\Common\Imageable;
use App\Common\Taggable;
use App\Common\Translatable;
use Illuminate\Support\Facades\Route;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

// Uncomment below line to enable Inspector plugin. (Have to install the plugin.)

class Product extends Inspectable
{
    use HasFactory, SoftDeletes, CascadeSoftDeletes, Taggable, Imageable, Searchable, Feedbackable, Translatable;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'products';

    /**
     * Cascade Soft Deletes Relationships
     *
     * @var array
     */
    protected $cascadeDeletes = ['inventories'];

    /**
     * The attributes that should be casted to boolean types.
     *
     * @var array
     */
    protected $casts = [
        'requires_shipping' => 'boolean',
        'downloadable' => 'boolean',
        'active' => 'boolean',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    /**
     * The attributes that should be inspectable for restricted keywords.
     *
     * @var array
     */
    protected static $inspectable = [
        'name',
        'description',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'shop_id',
        'manufacturer_id',
        'brand',
        'name',
        'model_number',
        'mpn',
        'gtin',
        'gtin_type',
        'description',
        'min_price',
        'max_price',
        'origin_country',
        'requires_shipping',
        'downloadable',
        'slug',
        'sale_count',
        'active',
        'shopify_id',
        'store_id',
        'price',
        'compare_price',
        'category_id',
        'stock',
        'is_featured',
        'is_active',
        'material',
        'gender',
        'rating',
        'reviews_count',
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $searchable = [];
        $searchable['id'] = $this->id;
        $searchable['shop_id'] = $this->shop_id;
        $searchable['name'] = $this->name;
        $searchable['slug'] = $this->slug;
        $searchable['model_number'] = $this->model_number;
        $searchable['manufacturer'] = $this->manufacturer_id ? $this->manufacturer->name : null;
        $searchable['mpn'] = $this->mpn;
        $searchable['gtin'] = $this->gtin;
        $searchable['description'] = str_replace('-', '‑', strip_tags($this->description));
        $searchable['active'] = $this->active;

        return $searchable;
    }

    /**
     * Modify the query used to retrieve models when making all of the models searchable.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function makeAllSearchableUsing($query)
    {
        return $query->with('manufacturer');
    }

    /**
     * Overwrote the image method in the imageable
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function image()
    {
        return $this->morphOne(\App\Models\Image::class, 'imageable')
            ->where(function ($q) {
                $q->whereNull('featured')->orWhere('featured', 0);
            })->orderBy('order', 'asc');
    }

    /**
     * Get the origin associated with the product.
     */
    public function origin()
    {
        return $this->belongsTo(Country::class, 'origin_country');
    }

    /**
     * Get the manufacturer associated with the product.
     */
    public function manufacturer()
    {
        return $this->belongsTo(Manufacturer::class)->withDefault();
    }

    /**
     * Get the shop associated with the product.
     */
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    /**
     * Storefront / Inertia "store" (same row as {@see shop()}, uses shops.id via store_id when set).
     */
    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Simplified catalog images (overrides {@see Imageable::images()} morph for this model).
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id')->orderBy('sort_order')->orderBy('id');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function flashSale()
    {
        return $this->hasOne(FlashSale::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function getEffectivePriceAttribute(): float
    {
        $flash = $this->relationLoaded('flashSale') ? $this->flashSale : $this->flashSale()->first();
        if ($flash && $flash->is_active
            && $flash->starts_at && $flash->ends_at
            && now()->between($flash->starts_at, $flash->ends_at)) {
            return (float) $flash->sale_price;
        }

        if ($this->price !== null) {
            return (float) $this->price;
        }

        return (float) ($this->min_price ?? 0);
    }

    /**
     * Get the categories for the product.
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTimestamps();
    }

    /**
     * Get the inventories for the product.
     */
    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    /**
     * Get the product's translations
     */
    public function translations()
    {
        return $this->hasMany(ProductTranslation::class);
    }

    /**
     * Check if the product was imported from Shopify
     *
     * @return bool
     */
    public function isFromShopify()
    {
        return (bool) $this->shopify_id;
    }

    /**
     * Set the requires_shipping for the Product.
     */
    public function setRequiresShippingAttribute($value)
    {
        $this->attributes['requires_shipping'] = (bool) $value;
    }

    /**
     * Set the downloadable for the Product.
     */
    public function setDownloadableAttribute($value)
    {
        $this->attributes['downloadable'] = (bool) $value;
    }

    /**
     * Get the category list for the product.
     *
     * @return array
     */
    public function getCategoryListAttribute()
    {
        if (count($this->categories)) {
            return $this->categories->pluck('id')->toArray();
        }
    }

    /**
     * Get the other vendors listings count for the product.
     *
     * @return int
     */
    public function getOffersAttribute()
    {
        return $this->inventories()->distinct('shop_id')->count('shop_id');
    }

    /**
     * Get the type for the product.
     *
     * @return array
     */
    public function getTypeAttribute()
    {
        return $this->downloadable ? trans('app.digital') : trans('app.physical');
    }

    /**
     * Set the Minimum price zero if the value is Null.
     */
    public function setMinPriceAttribute($value)
    {
        $this->attributes['min_price'] = $value ? $value : 0;
    }

    /**
     * Set the Maximum price null if the value is zero.
     */
    public function setMaxPriceAttribute($value)
    {
        $this->attributes['max_price'] = (bool) $value ? $value : null;
    }

    /**
     * Checking product has attributes or not
     */
    public function hasAttributes(): bool
    {
        if ($attrs = $this->categories->pluck('attrsList')) {
            return count($attrs->flatten()->unique('id')) > 0;
        }

        return false;
    }

    protected function getTranslationDisabledRoutes()
    {
        return ['admin.catalog.product.edit'];
    }

    protected static function booted(): void
    {
        static::saving(function (Product $product) {
            if ($product->isDirty('store_id') && $product->store_id) {
                $product->shop_id = $product->store_id;
            } elseif ($product->isDirty('shop_id') && $product->shop_id && empty($product->store_id)) {
                $product->store_id = $product->shop_id;
            }
        });
    }

    /**
     * Scope a query to only include physical products.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePhysical($query)
    {
        return $query->where('downloadable', 0);
    }

    /**
     * Scope a query to only include downloadable or digital products.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDigital($query)
    {
        return $query->where('downloadable', 1);
    }
}
