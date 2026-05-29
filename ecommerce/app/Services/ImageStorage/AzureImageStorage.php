<?php

namespace App\Services\ImageStorage;

use App\Contracts\ImageStorageContract;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AzureImageStorage implements ImageStorageContract
{
    public function store(UploadedFile $file, string $folder): string
    {
        return $file->store($folder, 'azure');
    }

    public function delete(string $path): void
    {
        if ($path) {
            Storage::disk('azure')->delete($path);
        }
    }

    public function url(string $path): string
    {
        return Storage::disk('azure')->url($path);
    }
}
