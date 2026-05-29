<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureSeller
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();
        if (! $user || (! $user->isMerchant() && ! $user->isAdmin())) {
            abort(403, 'Seller access required.');
        }
        return $next($request);
    }
}
