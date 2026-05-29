<?php

namespace App\Http\Controllers\Installer;

use App\Http\Controllers\Installer\Helpers\PermissionsChecker;
use App\Http\Requests;
use Illuminate\Routing\Controller;

class PermissionsController extends Controller
{
    protected $permissions;

    public function __construct(PermissionsChecker $checker)
    {
        $this->permissions = $checker;
    }

    public function permissions()
    {
        $permissions = $this->permissions->check(
            config('installer.permissions')
        );

        return view('installer.permissions', compact('permissions'));
    }
}
