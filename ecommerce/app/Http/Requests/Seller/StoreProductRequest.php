<?php

namespace App\Http\Requests\Seller;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:200'],
            'description'   => ['nullable', 'string'],
            'price'         => ['required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric'],
            'category_id'   => ['nullable', 'exists:categories,id'],
            'brand'         => ['nullable', 'string'],
            'material'      => ['nullable', 'string'],
            'gender'        => ['nullable', 'in:men,women,unisex,kids'],
            'stock'         => ['integer', 'min:0'],
            'images'        => ['nullable', 'array'],
            'images.*'      => ['image', 'max:2048'],
            'variants'      => ['nullable', 'array'],
        ];
    }
}

