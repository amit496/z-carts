<?php
/*   __________________________________________________
    |  Obfuscated by YAK Pro - Php Obfuscator  2.0.14  |
    |              on 2025-03-21 08:28:03              |
    |    GitHub: https://github.com/pk-fr/yakpro-po    |
    |__________________________________________________|
*/
/*
* Copyright (C) Incevio Systems, Inc - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written by Munna Khan <help.zcart@gmail.com>, September 2018
*/
 namespace App\Http\Controllers\Installer\Helpers; use Exception; use Illuminate\Support\Facades\Artisan; use Symfony\Component\Console\Output\BufferedOutput; class FinalInstallManager { public function runFinal() { $outputLog = new BufferedOutput(); $this->generateKey($outputLog); $this->publishVendorAssets($outputLog); return $outputLog->fetch(); } private static function generateKey($outputLog) { try { if (!config("\151\156\163\164\141\x6c\154\145\x72\x2e\x66\x69\156\141\x6c\x2e\153\x65\171")) { goto yBMx5; } Artisan::call("\x6b\x65\171\72\147\x65\x6e\145\x72\141\164\x65", ["\55\55\x66\x6f\x72\x63\145" => true], $outputLog); yBMx5: } catch (Exception $e) { return static::response($e->getMessage(), $outputLog); } return $outputLog; } private static function publishVendorAssets($outputLog) { try { if (!config("\x69\156\x73\164\141\x6c\154\x65\x72\x2e\146\x69\x6e\x61\154\56\160\x75\x62\x6c\x69\x73\x68")) { goto fumgt; } Artisan::call("\x76\x65\156\144\157\x72\72\160\x75\x62\154\151\163\x68", ["\x2d\55\141\x6c\x6c" => true], $outputLog); fumgt: } catch (Exception $e) { return static::response($e->getMessage(), $outputLog); } return $outputLog; } private static function response($message, $outputLog) { return ["\163\164\141\164\165\163" => "\x65\x72\x72\x6f\162", "\x6d\145\163\x73\x61\147\x65" => $message, "\x64\142\117\165\164\160\x75\164\x4c\x6f\x67" => $outputLog->fetch()]; } }
