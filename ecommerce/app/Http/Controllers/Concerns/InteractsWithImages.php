<?php

namespace App\Http\Controllers\Concerns;

use App\Services\ImageService;
use Illuminate\Http\UploadedFile;

trait InteractsWithImages
{
    protected function images(): ImageService
    {
        return app(ImageService::class);
    }

    protected function storeImage(UploadedFile $file, string $folder): string
    {
        return $this->images()->store($file, $folder);
    }

    protected function replaceImage(?string $oldPath, UploadedFile $newFile, string $folder): string
    {
        return $this->images()->replace($oldPath, $newFile, $folder);
    }

    protected function deleteImage(?string $path): void
    {
        $this->images()->delete($path);
    }
}

