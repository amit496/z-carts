<?php

namespace App\Http\Requests\Backend\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $category = $this->route('category');

        return [
            'name'             => ['required', 'string', 'max:255'],
            'slug'             => ['nullable', 'string', Rule::unique('categories', 'slug')->ignore($category->id)],
            'icon'             => ['nullable', 'string'],
            'order'            => ['nullable', 'integer'],
            'active'           => ['nullable', 'boolean'],
            'description'      => ['nullable', 'string'],
            'meta_title'       => ['nullable', 'string'],
            'meta_description' => ['nullable', 'string'],
            'image'            => ['nullable', 'image', 'max:2048'],
            'cover_image'      => ['nullable', 'image', 'max:2048'],
            'icon_image'       => ['nullable', 'image', 'max:2048'],
        ];
    }
}

