<?php

namespace App\Http\Requests\Validations;

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
        $categorySubGroup = $this->route('categorySubGroup');

        return [
            'parent_id'        => ['required', 'integer', Rule::exists('categories', 'id')->whereNull('parent_id')],
            'name'             => ['required', 'string', 'max:255'],
            'slug'             => ['required', 'string', 'alpha_dash', 'max:255', Rule::unique('categories', 'slug')->ignore($categorySubGroup->id)],
            'order'            => ['nullable', 'integer'],
            'active'           => ['nullable', 'boolean'],
            'description'      => ['nullable', 'string'],
            'meta_title'       => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'cover_image'      => ['nullable', 'image', 'max:2048'],
        ];
    }
}
