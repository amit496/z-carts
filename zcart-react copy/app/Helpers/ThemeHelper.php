<?php

namespace App\Helpers;

class ThemeHelper
{
    public static function getThemeAsset($path)
    {
        $theme = config('app.theme', 'default');
        return asset("themes/{$theme}/assets/{$path}");
    }

    public static function getThemeView($view)
    {
        $theme = config('app.theme', 'default');
        return "themes.{$theme}.views.{$view}";
    }

    public static function renderBladeToReact($bladePath, $data = [])
    {
        // Convert Blade template to React-compatible data
        return [
            'template' => $bladePath,
            'data' => $data,
            'assets' => [
                'css' => self::getThemeAsset('css/style.css'),
                'js' => self::getThemeAsset('js/app.js'),
            ]
        ];
    }
}