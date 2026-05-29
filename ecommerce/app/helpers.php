<?php

declare(strict_types=1);

/**
 * zCart-style helpers expected by Database\Seeders\BaseSeeder and related seeders.
 */

if (! function_exists('image_storage_dir')) {
    /**
     * Relative directory on the default filesystem disk used for image uploads.
     */
    function image_storage_dir(): string
    {
        return (string) config('filesystems.image_storage_dir', 'images');
    }
}

if (! function_exists('get_platform_title')) {
    function get_platform_title(): string
    {
        return (string) config('app.name', 'Laravel');
    }
}
