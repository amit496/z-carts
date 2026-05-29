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
 namespace App\Http\Controllers\Installer\Helpers; use Exception; use Illuminate\Http\Request; class EnvironmentManager { private $envPath; private $envExamplePath; public function __construct() { $this->envPath = base_path("\56\x65\x6e\x76"); $this->envExamplePath = base_path("\x2e\145\156\166\x2e\145\170\141\x6d\160\154\x65"); } public function getEnvContent() { if (file_exists($this->envPath)) { goto j99m5; } if (file_exists($this->envExamplePath)) { goto F7FRP; } touch($this->envPath); goto Jt97E; F7FRP: copy($this->envExamplePath, $this->envPath); Jt97E: j99m5: return file_get_contents($this->envPath); } public function getEnvPath() { return $this->envPath; } public function getEnvExamplePath() { return $this->envExamplePath; } public function saveFileClassic(Request $input) { $message = trans("\151\x6e\163\x74\x61\x6c\154\145\x72\x5f\x6d\x65\163\x73\x61\147\x65\x73\56\x65\156\166\x69\162\x6f\x6e\155\145\x6e\x74\x2e\163\x75\143\x63\x65\163\163"); try { file_put_contents($this->envPath, $input->get("\x65\x6e\x76\103\157\156\x66\151\x67")); } catch (Exception $e) { $message = trans("\x69\x6e\x73\x74\x61\x6c\x6c\145\x72\x5f\155\145\x73\163\141\147\145\163\x2e\145\156\166\151\x72\x6f\x6e\155\145\156\x74\56\x65\162\162\x6f\x72\163"); } return $message; } }
