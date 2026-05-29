<?php

namespace App\Http\Requests\Backend\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAdminProductRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->input('gender') === '') {
            $this->merge(['gender' => null]);
        }
        if ($this->input('compare_price') === '' || $this->input('compare_price') === null) {
            $this->merge(['compare_price' => null]);
        }
        if ($this->input('slug') === '') {
            $this->merge(['slug' => null]);
        }
        if ($this->input('manufacturer_id') === '' || $this->input('manufacturer_id') === null) {
            $this->merge(['manufacturer_id' => null]);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'store_id'              => ['required', 'exists:stores,id'],
            'category_ids'          => ['required', 'array', 'min:1'],
            'category_ids.*'        => ['integer', 'exists:categories,id'],
            'name'                  => ['required', 'string', 'max:255'],
            'description'           => ['nullable', 'string'],
            'price'                 => ['required', 'numeric', 'min:0'],
            'compare_price'         => ['nullable', 'numeric', 'min:0'],
            'brand'                 => ['nullable', 'string', 'max:255'],
            'manufacturer_id'       => ['nullable', 'integer', 'exists:manufacturers,id'],
            'manufacturer'          => ['nullable', 'string', 'max:255'],
            'material'              => ['nullable', 'string', 'max:255'],
            'gender'                => ['nullable', Rule::in(['women', 'men', 'unisex', 'kids'])],
            'stock'                 => ['required', 'integer', 'min:0'],
            'is_featured'           => ['nullable', 'boolean'],
            'is_active'             => ['nullable', 'boolean'],
            'product_type'          => ['required', Rule::in(['physical', 'digital', 'service'])],
            'requires_shipping'     => ['nullable', 'boolean'],
            'model_number'          => ['nullable', 'string', 'max:255'],
            'gtin'                  => ['nullable', 'string', 'max:64'],
            'mpn'                   => ['nullable', 'string', 'max:64'],
            'origin_country'        => ['nullable', 'string', 'max:255'],
            'meta_title'            => ['nullable', 'string', 'max:255'],
            'meta_description'      => ['nullable', 'string', 'max:2000'],
            'available_from'        => ['nullable', 'date'],
            'primary_image'         => ['nullable', 'image', 'max:8192'],
            'gallery'               => ['nullable', 'array'],
            'gallery.*'             => ['image', 'max:8192'],
            'variants_json'         => ['nullable', 'string'],
            'slug'                  => ['nullable', 'string', 'max:255', 'unique:products,slug'],
        ];
    }
}
