<?php

namespace App\Http\Controllers\Installer;

use App\Http\Controllers\Installer\Helpers\RequirementsChecker;
use Illuminate\Routing\Controller;

class RequirementsController extends Controller
{
    protected $requirements;

    public function __construct(RequirementsChecker $checker)
    {
        $this->requirements = $checker;
    }

    public function requirements()
    {
        $phpSupportInfo = $this->requirements->checkPHPversion(
            config('installer.core.minPhpVersion'),
            config('installer.core.maxPhpVersion')
        );

        $requirements = $this->requirements->check(
            config('installer.requirements')
        );

        return view('installer.requirements', compact('requirements', 'phpSupportInfo'));
    }
}
