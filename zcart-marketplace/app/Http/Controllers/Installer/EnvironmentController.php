<?php

namespace App\Http\Controllers\Installer;

use App\Http\Controllers\Installer\Helpers\EnvironmentManager;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Routing\Redirector;
use Validator;

class EnvironmentController extends Controller
{
    protected $EnvironmentManager;

    public function __construct(EnvironmentManager $environmentManager)
    {
        $this->EnvironmentManager = $environmentManager;
    }

    public function environmentMenu()
    {
        return view('installer.environment');
    }

    public function environmentWizard()
    {
        // TODO: Implement the environment wizard logic
    }

    public function environmentClassic()
    {
        $envConfig = $this->EnvironmentManager->getEnvContent();

        return view('installer.environment-classic', compact('envConfig'));
    }

    public function saveClassic(Request $input, Redirector $redirect)
    {
        $message = $this->EnvironmentManager->saveFileClassic($input);

        return $redirect->route('Installer.environmentClassic')
            ->with(['message' => $message]);
    }
}
