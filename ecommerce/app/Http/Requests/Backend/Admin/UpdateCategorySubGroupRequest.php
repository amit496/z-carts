<?php

namespace App\Http\Requests\Backend\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategorySubGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $category = $this->route('category');

        return [
            'name'               => ['required', 'string', 'max:255'],
            'slug'               => ['required', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($category->id)],
            'parent_id'          => ['required', Rule::exists('categories', 'id')->whereNull('parent_id')],
            'order'              => ['nullable', 'integer'],
            'active'             => ['nullable', 'boolean'],
            'description'        => ['nullable', 'string'],
            'meta_title'         => ['nullable', 'string', 'max:255'],
            'meta_description'   => ['nullable', 'string'],
            'cover_image'        => ['nullable', 'image', 'max:2048'],
        ];
    }
}
