<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Shops/Verifications', [
            'shops' => Shop::with('owner')->latest()->paginate(25)->through(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'owner' => $s->owner?->name,
                'active' => (bool)$s->active,
                'id_verified' => (bool)$s->id_verified,
                'phone_verified' => (bool)$s->phone_verified,
                'address_verified' => (bool)$s->address_verified,
            ]),
        ]);
    }

    public function update(Request $r, Shop $shop)
    {
        $data = $r->validate([
            'id_verified' => 'boolean',
            'phone_verified' => 'boolean',
            'address_verified' => 'boolean',
        ]);

        $shop->update($data);
        return back()->with('success', 'Verification updated.');
    }
}

