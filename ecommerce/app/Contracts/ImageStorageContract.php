<?php

namespace App\Contracts;

interface ImageStorageContract
{
    /**
     * Store an uploaded file and return the stored path/URL.
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     * @param  string  $folder   e.g. 'categories', 'products', 'users'
     * @return string            stored path or URL
     */
    public function store(\Illuminate\Http\UploadedFile $file, string $folder): string;

    /**
     * Delete a previously stored image by its path/URL.
     */
    public function delete(string $path): void;

    /**
     * Resolve a stored path/URL to a publicly accessible URL.
     */
    public function url(string $path): string;
}
