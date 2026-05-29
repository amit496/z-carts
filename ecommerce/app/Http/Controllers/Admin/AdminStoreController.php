<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminStoreController extends Controller
{
    public function index()
    {
        $stores = Store::with('user', 'products')->latest()->paginate(12);

        return Inertia::render('Admin/Stores/Index', [
            'stores' => $stores,
            'stats' => [
                'total' => Store::count(),
                'approved' => Store::where('status', 'approved')->count(),
                'pending' => Store::where('status', 'pending')->count(),
                'suspended' => Store::where('status', 'suspended')->count(),
            ],
        ]);
    }

    public function pending()
    {
        $stores = Store::with('user', 'products')->where('status', 'pending')->latest()->paginate(12);
        return Inertia::render('Admin/Stores/Index', [
            'stores' => $stores,
            'stats'  => ['total' => Store::where('status','pending')->count(), 'approved' => 0, 'pending' => Store::where('status','pending')->count(), 'suspended' => 0],
        ]);
    }

    public function approved()
    {
        $stores = Store::with('user', 'products')->where('status', 'approved')->latest()->paginate(12);
        return Inertia::render('Admin/Stores/Index', [
            'stores' => $stores,
            'stats'  => ['total' => Store::where('status','approved')->count(), 'approved' => Store::where('status','approved')->count(), 'pending' => 0, 'suspended' => 0],
        ]);
    }

    public function suspended()
    {
        $stores = Store::with('user', 'products')->where('status', 'suspended')->latest()->paginate(12);
        return Inertia::render('Admin/Stores/Index', [
            'stores' => $stores,
            'stats'  => ['total' => Store::where('status','suspended')->count(), 'approved' => 0, 'pending' => 0, 'suspended' => Store::where('status','suspended')->count()],
        ]);
    }

    public function updateStatus(Request $request, Store $store)
    {
        $request->validate(['status' => 'required|in:approved,suspended,pending']);
        $store->update(['status' => $request->status]);

        UserNotification::create([
            'user_id' => $store->user_id,
            'type' => 'store_status',
            'title' => 'Store Status Updated',
            'body' => "Your store \"{$store->name}\" has been {$request->status}.",
            'data' => ['store_id' => $store->id],
        ]);

        return back()->with('success', 'Store status updated.');
    }
}
