<?php

namespace App\Http\Controllers\Installer;

use App\Http\Controllers\Installer\Helpers\DatabaseManager;
use App\Http\Controllers\Installer\Helpers\EnvironmentManager;
use App\Http\Controllers\Installer\Helpers\FinalInstallManager;
use App\Http\Controllers\Installer\Helpers\InstalledFileManager;
use Illuminate\Routing\Controller;

class FinalController extends Controller
{
    public function final(FinalInstallManager $finalInstall, EnvironmentManager $environment)
    {
        $finalMessages = $finalInstall->runFinal();
        $finalEnvFile = $environment->getEnvContent();

        return view('installer.finished', compact('finalMessages', 'finalEnvFile'));
    }

    public function seedDemo(DatabaseManager $databaseManager)
    {
        $response = $databaseManager->seedDemoData();

        return redirect()->route('Installer.finish');
    }

    public function finish(InstalledFileManager $fileManager)
    {
        $finalStatusMessage = $fileManager->update();

        return redirect()
            ->to(config('installer.redirectUrl'))
            ->with('message', $finalStatusMessage);
    }
}
