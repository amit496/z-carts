<?php

namespace App\Http\Requests\Backend\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCatalogCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parent_id'        => ['required', Rule::exists('categories', 'id')->where(function ($q) {
                $q->whereNotNull('parent_id')
                    ->whereIn('parent_id', Category::query()->whereNull('parent_id')->select('id'));
            })],
            'name'             => ['required', 'string', 'max:255'],
            'slug'             => ['required', 'string', 'max:255', 'unique:categories,slug'],
            'order'            => ['nullable', 'integer'],
            'active'           => ['nullable', 'boolean'],
            'is_featured'      => ['nullable', 'boolean'],
            'description'      => ['nullable', 'string'],
            'meta_title'       => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'cover_image'      => ['nullable', 'image', 'max:2048'],
            'image'            => ['nullable', 'image', 'max:2048'],
        ];
    }
}
