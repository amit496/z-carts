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
 namespace App\Http\Controllers\Installer\Helpers; class InstalledFileManager { public function create() { $installedLogFile = storage_path("\151\x6e\x73\x74\x61\x6c\154\x65\144"); $dateStamp = date("\x59\57\x6d\57\x64\40\150\72\x69\72\163\141"); if (!file_exists($installedLogFile)) { goto BsJcg; } $message = trans("\151\156\163\164\141\154\154\x65\162\137\155\x65\163\x73\141\x67\x65\163\56\x75\160\144\x61\x74\145\x72\x2e\154\x6f\147\x2e\x73\x75\x63\x63\145\x73\163\x5f\155\x65\x73\163\x61\x67\x65") . $dateStamp; file_put_contents($installedLogFile, $message . PHP_EOL, FILE_APPEND | LOCK_EX); goto qrwib; BsJcg: $message = trans("\x69\156\x73\x74\141\x6c\154\x65\162\137\155\145\x73\x73\141\x67\145\x73\x2e\151\x6e\163\x74\141\154\x6c\145\x64\56\x73\x75\x63\143\x65\x73\163\x5f\154\157\x67\x5f\x6d\145\x73\163\141\147\x65") . $dateStamp . "\12"; file_put_contents($installedLogFile, $message); qrwib: return $message; } public function update() { return $this->create(); } }
