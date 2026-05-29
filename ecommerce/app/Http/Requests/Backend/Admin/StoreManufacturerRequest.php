<?php

namespace App\Http\Requests\Backend\Admin;

class StoreManufacturerRequest extends ManufacturerRequest
{
    /** @inheritDoc */
    public function rules(): array
    {
        return array_merge($this->manufacturerBodyRules(), [
            'slug' => ['nullable', 'string', 'max:255', 'unique:manufacturers,slug'],
        ]);
    }
}
