<?php

namespace App\Http\Requests\Validations;

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
        $categoryGroup = $this->route('categoryGroup');

        return [
            'name'             => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($categoryGroup->id)],
            'slug'             => ['nullable', 'string', 'alpha_dash', Rule::unique('categories', 'slug')->ignore($categoryGroup->id)],
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
