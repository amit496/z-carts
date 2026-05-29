<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;

class AdminPromotionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Promotions/Index');
    }

    public function trending()
    {
        $keywords = Product::select('name', 'brand', 'gender', 'material')
            ->where('is_active', true)
            ->get()
            ->flatMap(fn($p) => array_filter([$p->brand, $p->gender, $p->material]))
            ->countBy()
            ->sortDesc()
            ->take(30)
            ->map(fn($count, $word) => ['word' => $word, 'count' => $count])
            ->values();

        return Inertia::render('Admin/Promotions/Trending', ['keywords' => $keywords]);
    }
}
