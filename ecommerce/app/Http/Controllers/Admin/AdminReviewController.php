<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Inertia\Inertia;

class AdminReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('user', 'product')->latest()->paginate(20);
        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
            'stats' => [
                'total'    => Review::count(),
                'verified' => Review::where('is_verified', true)->count(),
                'avg'      => round(Review::avg('rating'), 1),
            ],
        ]);
    }

    public function toggle(Review $review)
    {
        $review->update(['is_verified' => !$review->is_verified]);
        return back();
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return back()->with('success', 'Review deleted.');
    }
}
