<?php

namespace App\Http\Requests\Backend\Admin;

use App\Models\Manufacturer;
use Illuminate\Validation\Rule;

class UpdateManufacturerRequest extends ManufacturerRequest
{
    /** @inheritDoc */
    public function rules(): array
    {
        /** @var Manufacturer $manufacturer */
        $manufacturer = $this->route('manufacturer');

        return array_merge($this->manufacturerBodyRules(), [
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('manufacturers', 'slug')->ignore($manufacturer->id),
            ],
        ]);
    }
}
