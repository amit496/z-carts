<?php

namespace App\Services\ImageStorage;

use App\Contracts\ImageStorageContract;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class S3ImageStorage implements ImageStorageContract
{
    public function store(UploadedFile $file, string $folder): string
    {
        return $file->store($folder, 's3');
    }

    public function delete(string $path): void
    {
        if ($path) {
            Storage::disk('s3')->delete($path);
        }
    }

    public function url(string $path): string
    {
        return Storage::disk('s3')->url($path);
    }
}
