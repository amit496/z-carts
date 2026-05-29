<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChatController extends Controller
{
    private string $path = 'admin/chat.json';

    public function index()
    {
        $json = Storage::exists($this->path) ? Storage::get($this->path) : "{\n  \"enabled\": true,\n  \"provider\": \"\",\n  \"notes\": \"\"\n}\n";

        return Inertia::render('Admin/Settings/Chat', [
            'json' => $json,
        ]);
    }

    public function update(Request $r)
    {
        $data = $r->validate(['json' => 'required|string']);
        $json = $data['json'];

        json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return back()->withErrors(['json' => 'Invalid JSON: ' . json_last_error_msg()]);
        }

        Storage::put($this->path, $json);
        return back()->with('success', 'Chat settings saved.');
    }
}

