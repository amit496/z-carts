<?php

/**
 * One-off generator: reads zcart-reference migrations and creates Eloquent stubs in App\Models\Zcart.
 * Re-run after adding migrations: php scripts/generate_zcart_models.php
 */

declare(strict_types=1);

require dirname(__DIR__).'/vendor/autoload.php';

use Illuminate\Support\Str;

$migrationsDir = dirname(__DIR__).'/zcart-reference/database/migrations';
$outDir = dirname(__DIR__).'/app/Models/Zcart';

if (! is_dir($migrationsDir)) {
    fwrite(STDERR, "Missing zcart-reference migrations at: {$migrationsDir}\n");
    exit(1);
}

if (! is_dir($outDir)) {
    mkdir($outDir, 0755, true);
}

$tables = [];
foreach (glob($migrationsDir.'/*.php') ?: [] as $file) {
    $content = (string) file_get_contents($file);
    if (preg_match_all('/Schema::create\(\s*[\'"]([^\'"]+)[\'"]/', $content, $m)) {
        foreach ($m[1] as $t) {
            $tables[$t] = true;
        }
    }
}

$tableList = array_keys($tables);
sort($tableList);

/** @var array<string, string> Explicit class names where singular/studly is wrong */
$classOverrides = [
    'contact_us' => 'ContactUs',
];

// Build unique class names per table
$final = [];
foreach ($tableList as $table) {
    $class = $classOverrides[$table] ?? Str::studly(Str::singular($table));
    $unique = $class;
    $n = 2;
    while (isset($final[$unique]) && $final[$unique] !== $table) {
        $unique = $class.$n;
        ++$n;
    }
    $final[$unique] = $table;
}

$header = <<<'PHP'
<?php

namespace App\Models\Zcart;

use Illuminate\Database\Eloquent\Model;

/**
 * zCart schema (reference). Table merged later — adjust fillable/casts/relations when wiring.
 */
PHP;

foreach ($final as $className => $table) {
    $path = $outDir.'/'.$className.'.php';
    $body = <<<PHP
{$header}

class {$className} extends Model
{
    protected \$table = '{$table}';

    /** @var list<string>|bool */
    protected \$guarded = [];

    protected \$casts = [];
}

PHP;
    file_put_contents($path, $body);
}

echo 'Generated '.count($final)." models in app/Models/Zcart/\n";
