<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Inertia\Inertia;

class VisitorController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reports/Visitors', [
            'visitors' => Visitor::latest()->paginate(30)->through(fn ($v) => [
                'id' => $v->id,
                'ip_address' => $v->ip_address,
                'url' => $v->url,
                'visited_at' => $v->visited_at,
                'created_at' => optional($v->created_at)->toDateTimeString(),
            ]),
        ]);
    }
}

