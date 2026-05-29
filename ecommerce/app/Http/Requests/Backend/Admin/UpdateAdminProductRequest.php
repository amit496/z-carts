<?php

namespace App\Http\Requests\Backend\Admin;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdminProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('gender') === '') {
            $this->merge(['gender' => null]);
        }
        if ($this->input('compare_price') === '') {
            $this->merge(['compare_price' => null]);
        }
        if ($this->input('slug') === '') {
            $this->merge(['slug' => null]);
        }
        if ($this->input('manufacturer_id') === '' || $this->input('manufacturer_id') === null) {
            $this->merge(['manufacturer_id' => null]);
        }

        $product = $this->route('product');
        $raw = $this->input('remove_image_ids');
        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            $ids = is_array($decoded) ? array_map('intval', $decoded) : [];
        } elseif (is_array($raw)) {
            $ids = array_map('intval', $raw);
        } else {
            $ids = [];
        }
        $ids = array_values(array_unique(array_filter($ids)));

        /** Drop stale IDs (already deleted clientside state / double submit). */
        if ($product instanceof Product && $ids !== []) {
            $existing = ProductImage::query()->where('product_id', $product->id)->whereIn('id', $ids)->pluck('id')->all();
            $ids = array_values(array_map('intval', $existing));
        }

        $this->merge(['remove_image_ids' => $ids]);
    }

    public function rules(): array
    {
        /** @var Product $product */
        $product = $this->route('product');

        return [
            'store_id'             => ['required', 'exists:stores,id'],
            'category_ids'         => ['required', 'array', 'min:1'],
            'category_ids.*'       => ['integer', 'exists:categories,id'],
            'name'                 => ['required', 'string', 'max:255'],
            'description'          => ['nullable', 'string'],
            'price'                => ['required', 'numeric', 'min:0'],
            'compare_price'        => ['nullable', 'numeric', 'min:0'],
            'brand'                => ['nullable', 'string', 'max:255'],
            'manufacturer_id'      => ['nullable', 'integer', 'exists:manufacturers,id'],
            'manufacturer'         => ['nullable', 'string', 'max:255'],
            'material'             => ['nullable', 'string', 'max:255'],
            'gender'               => ['nullable', Rule::in(['women', 'men', 'unisex', 'kids'])],
            'stock'                => ['required', 'integer', 'min:0'],
            'is_featured'          => ['nullable', 'boolean'],
            'is_active'            => ['nullable', 'boolean'],
            'product_type'         => ['required', Rule::in(['physical', 'digital', 'service'])],
            'requires_shipping'    => ['nullable', 'boolean'],
            'model_number'         => ['nullable', 'string', 'max:255'],
            'gtin'                 => ['nullable', 'string', 'max:64'],
            'mpn'                  => ['nullable', 'string', 'max:64'],
            'origin_country'       => ['nullable', 'string', 'max:255'],
            'meta_title'           => ['nullable', 'string', 'max:255'],
            'meta_description'     => ['nullable', 'string', 'max:2000'],
            'available_from'       => ['nullable', 'date'],
            'primary_image'        => ['nullable', 'image', 'max:8192'],
            'gallery'              => ['nullable', 'array'],
            'gallery.*'            => ['image', 'max:8192'],
            'remove_image_ids'     => ['nullable', 'array'],
            'remove_image_ids.*'   => [
                'integer',
                Rule::exists('product_images', 'id')->where(fn ($q) => $q->where('product_id', $product->id)),
            ],
            'variants_json'        => ['nullable', 'string'],
            'slug'                 => ['nullable', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($product->id)],
        ];
    }

}
