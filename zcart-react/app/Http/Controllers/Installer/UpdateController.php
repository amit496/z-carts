<?php

namespace App\Http\Controllers\Installer;

use App\Http\Controllers\Installer\Helpers\DatabaseManager;
use App\Http\Controllers\Installer\Helpers\InstalledFileManager;
use Illuminate\Routing\Controller;

class UpdateController extends Controller
{
    use \App\Http\Controllers\Installer\Helpers\MigrationsHelper;

    public function welcome()
    {
        return view('installer.update.welcome');
    }

    public function overview()
    {
        $migrations = $this->getMigrations();
        $dbMigrations = $this->getExecutedMigrations();

        return view('installer.update.overview', [
            'numberOfUpdatesPending' => count($migrations) - count($dbMigrations),
        ]);
    }

    public function database()
    {
        $databaseManager = new DatabaseManager();
        $response = $databaseManager->migrateAndSeed();

        return redirect()
            ->route('LaravelUpdater::final')
            ->with(['message' => $response]);
    }

    public function finish(InstalledFileManager $fileManager)
    {
        $fileManager->update();

        return view('installer.update.finished');
    }
}
