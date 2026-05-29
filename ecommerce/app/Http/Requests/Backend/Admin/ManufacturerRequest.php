<?php

namespace App\Http\Requests\Backend\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

/**
 * Shared validation prep and body rules for manufacturer create/update.
 */
abstract class ManufacturerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('slug') === '') {
            $this->merge(['slug' => null]);
        }
        if ($this->input('description') === '') {
            $this->merge(['description' => null]);
        }
        if ($this->input('url') === '') {
            $this->merge(['url' => null]);
        }
        if ($this->input('country') === '') {
            $this->merge(['country' => null]);
        }
        if ($this->input('email') === '') {
            $this->merge(['email' => null]);
        }
        if ($this->input('phone') === '') {
            $this->merge(['phone' => null]);
        }
        if ($this->filled('slug')) {
            $this->merge(['slug' => Str::slug($this->string('slug'))]);
        }
    }

    /** @return array<string, mixed> */
    protected function manufacturerBodyRules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'is_active'   => ['nullable', 'boolean'],
            'url'         => ['nullable', 'string', 'max:2048'],
            'country'     => ['nullable', 'string', 'max:255'],
            'email'       => ['nullable', 'email', 'max:255'],
            'phone'       => ['nullable', 'string', 'max:64'],
            'description' => ['nullable', 'string'],
            'logo'        => ['nullable', 'image', 'max:8192'],
        ];
    }

    abstract public function rules(): array;
}
