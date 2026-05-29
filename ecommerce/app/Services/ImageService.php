<?php

namespace App\Services;

use App\Contracts\ImageStorageContract;
use Illuminate\Http\UploadedFile;

class ImageService
{
    public function __construct(protected ImageStorageContract $storage) {}

    /**
     * Store an uploaded file.
     * Returns stored path (e.g. "categories/abc.jpg")
     */
    public function store(UploadedFile $file, string $folder): string
    {
        return $this->storage->store($file, $folder);
    }

    /**
     * Replace old image with new one — deletes old, stores new.
     */
    public function replace(?string $oldPath, UploadedFile $newFile, string $folder): string
    {
        if ($oldPath) {
            $this->storage->delete($oldPath);
        }
        return $this->storage->store($newFile, $folder);
    }

    /**
     * Delete an image by path.
     */
    public function delete(?string $path): void
    {
        if ($path) {
            $this->storage->delete($path);
        }
    }

    /**
     * Resolve a stored path to a public URL.
     * Handles both local paths and full http URLs (e.g. seeded Unsplash URLs).
     */
    public function url(?string $path): ?string
    {
        if (!$path) return null;
        if (str_starts_with($path, 'http')) return $path;
        return $this->storage->url($path);
    }
}
