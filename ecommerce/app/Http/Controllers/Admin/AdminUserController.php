<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('store')->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        if ($request->role) $query->where('role', $request->role);
        if ($request->status === 'active') $query->where('is_active', true);
        if ($request->status === 'banned') $query->where('is_active', false);

        $users = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only('search', 'role', 'status'),
            'stats' => [
                'total' => User::count(),
                'admins' => User::where('role', 'admin')->count(),
                'sellers' => User::where('role', 'seller')->count(),
                'buyers' => User::where('role', 'buyer')->count(),
                'active' => User::where('is_active', true)->count(),
            ],
        ]);
    }

    public function customers(Request $request)
    {
        $users = User::with('store')->where('role', 'buyer')->latest()->paginate(20);
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => ['role' => 'buyer'],
            'stats' => [
                'total'   => User::where('role', 'buyer')->count(),
                'active'  => User::where('role', 'buyer')->where('is_active', true)->count(),
                'admins'  => 0,
                'sellers' => 0,
                'buyers'  => User::where('role', 'buyer')->count(),
            ],
        ]);
    }

    public function sellers(Request $request)
    {
        $users = User::with('store')->where('role', 'seller')->latest()->paginate(20);
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => ['role' => 'seller'],
            'stats' => [
                'total'   => User::where('role', 'seller')->count(),
                'active'  => User::where('role', 'seller')->where('is_active', true)->count(),
                'admins'  => 0,
                'sellers' => User::where('role', 'seller')->count(),
                'buyers'  => 0,
            ],
        ]);
    }

    public function affiliates()
    {
        return Inertia::render('Admin/Users/Affiliates');
    }

    public function toggleActive(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        return back();
    }

    public function changeRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|in:admin,seller,buyer']);
        $user->update(['role' => $request->role]);
        return back()->with('success', 'Role updated.');
    }
}
