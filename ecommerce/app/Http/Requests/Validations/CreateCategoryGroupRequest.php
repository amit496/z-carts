<?php

namespace App\Http\Requests\Validations;

use Illuminate\Foundation\Http\FormRequest;

class CreateCategoryGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'             => ['required', 'string', 'max:255', 'unique:categories,name'],
            'slug'             => ['nullable', 'string', 'alpha_dash', 'unique:categories,slug'],
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
