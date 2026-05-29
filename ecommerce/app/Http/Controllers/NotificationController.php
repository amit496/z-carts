<?php
namespace App\Http\Controllers;

use App\Models\UserNotification;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = UserNotification::where('user_id', auth()->id())->latest()->paginate(20);
        return response()->json($notifications);
    }

    public function markRead(UserNotification $notification)
    {
        abort_if($notification->user_id !== auth()->id(), 403);
        $notification->update(['is_read' => true]);
        return back();
    }

    public function markAllRead()
    {
        UserNotification::where('user_id', auth()->id())->update(['is_read' => true]);
        return back();
    }
}
