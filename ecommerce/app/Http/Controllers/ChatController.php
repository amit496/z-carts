<?php
namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\ChatMessage;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->isSeller()) {
            $store = $user->store;
            $chats = Chat::with('buyer', 'product', 'lastMessage')
                ->where('store_id', $store?->id)->latest('last_message_at')->get();
        } else {
            $chats = Chat::with('store', 'product', 'lastMessage')
                ->where('buyer_id', $user->id)->latest('last_message_at')->get();
        }
        return Inertia::render('Chat/Index', ['chats' => $chats]);
    }

    public function show(Chat $chat)
    {
        $user = auth()->user();
        $isBuyer = $chat->buyer_id === $user->id;
        $isSeller = $user->isSeller() && $user->store?->id === $chat->store_id;
        abort_if(!$isBuyer && !$isSeller, 403);

        $chat->messages()->where('sender_id', '!=', $user->id)->update(['is_read' => true]);
        $chat->load('messages.sender', 'buyer', 'store', 'product');

        return Inertia::render('Chat/Show', ['chat' => $chat]);
    }

    public function startOrGet(Request $request)
    {
        $request->validate(['store_id' => 'required|exists:shops,id', 'product_id' => 'nullable|exists:products,id']);

        $chat = Chat::firstOrCreate(
            ['buyer_id' => auth()->id(), 'store_id' => $request->store_id],
            ['product_id' => $request->product_id]
        );

        return redirect()->route('chat.show', $chat->id);
    }

    public function sendMessage(Request $request, Chat $chat)
    {
        $user = auth()->user();
        $isBuyer = $chat->buyer_id === $user->id;
        $isSeller = $user->isSeller() && $user->store?->id === $chat->store_id;
        abort_if(!$isBuyer && !$isSeller, 403);

        $request->validate(['message' => 'required|string|max:1000']);

        ChatMessage::create(['chat_id' => $chat->id, 'sender_id' => $user->id, 'message' => $request->message]);
        $chat->update(['last_message_at' => now()]);

        return back();
    }
}
