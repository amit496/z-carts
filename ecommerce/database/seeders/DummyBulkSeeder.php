<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\PdfTemplate;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * One-shot demo bulk data (100+ rows): merchants, shops, products, inventories,
 * customers, addresses, orders + items. Uses DB + fake() only — fast to tweak.
 *
 * Run after base seeders: php artisan db:seed --class=DummyBulkSeeder
 * Or full: php artisan migrate:fresh --seed (DummyBulkSeeder is chained from DatabaseSeeder).
 */
class DummyBulkSeeder extends Seeder
{
    /** Count per entity type (total rows ≫ this number). */
    public const N = 50;

    public function run(): void
    {
        if (DB::table('customers')->where('email', 'like', '%@dummy.local')->exists()) {
            $this->command?->info('DummyBulkSeeder: already seeded (dummy.local emails exist). Skip.');

            return;
        }

        $faker = fake('en_IN');
        $now = Carbon::now();
        $pw = bcrypt('123456');

        $paymentMethodId = (int) DB::table('payment_methods')->orderBy('id')->value('id');
        $currencyId = DB::table('systems')->value('currency_id')
            ?? DB::table('currencies')->orderBy('id')->value('id');

        $countryId = (int) (DB::table('countries')->inRandomOrder()->value('id') ?? 1);
        $stateId = DB::table('states')->where('country_id', $countryId)->inRandomOrder()->value('id');

        $invoiceTplId = (int) (DB::table('pdf_templates')
            ->where('type', PdfTemplate::TYPE_ORDER_INVOICE)
            ->where('is_default', 1)
            ->value('id')
            ?? DB::table('pdf_templates')->where('type', PdfTemplate::TYPE_ORDER_INVOICE)->value('id')
            ?? 0);
        $shipTplId = (int) (DB::table('pdf_templates')
            ->where('type', PdfTemplate::TYPE_SHIPPING_LABEL)
            ->where('is_default', 1)
            ->value('id')
            ?? DB::table('pdf_templates')->where('type', PdfTemplate::TYPE_SHIPPING_LABEL)->value('id')
            ?? 0);

        $shopIds = [];
        for ($m = 0; $m < 10; $m++) {
            $uid = DB::table('users')->insertGetId([
                'role_id' => Role::MERCHANT,
                'name' => $faker->company(),
                'email' => 'merchant-'.Str::lower(Str::random(8)).'@dummy.local',
                'password' => $pw,
                'active' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            $slug = Str::slug($faker->unique()->company());
            $sid = DB::table('shops')->insertGetId([
                'owner_id' => $uid,
                'name' => $faker->company(),
                'legal_name' => $faker->company(),
                'slug' => $slug.'-'.$uid,
                'email' => 'shop-'.$uid.'@dummy.local',
                'active' => 1,
                'order_invoice_template_id' => $invoiceTplId,
                'shipping_label_template_id' => $shipTplId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            $shopIds[] = $sid;
        }

        $productIds = [];
        for ($i = 0; $i < self::N; $i++) {
            $shopId = $shopIds[array_rand($shopIds)];
            $name = $faker->words(3, true);
            $productIds[] = DB::table('products')->insertGetId([
                'shop_id' => $shopId,
                'name' => $name,
                'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
                'min_price' => $faker->randomFloat(2, 100, 5000),
                'active' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $inventoryIds = [];
        foreach ($productIds as $idx => $productId) {
            $shopId = (int) DB::table('products')->where('id', $productId)->value('shop_id');
            $title = $faker->sentence(4);
            $inventoryIds[] = DB::table('inventories')->insertGetId([
                'shop_id' => $shopId,
                'product_id' => $productId,
                'title' => $title,
                'sku' => 'SKU-'.str_pad((string) ($idx + 1), 5, '0', STR_PAD_LEFT).'-'.Str::lower(Str::random(4)),
                'condition' => 'New',
                'stock_quantity' => $faker->numberBetween(1, 200),
                'sale_price' => $faker->randomFloat(2, 100, 8000),
                'length' => $faker->randomFloat(4, 1, 100),
                'width' => $faker->randomFloat(4, 1, 100),
                'height' => $faker->randomFloat(4, 1, 100),
                'distance_unit' => 'cm',
                'slug' => 'inv-'.Str::slug($title).'-'.Str::lower(Str::random(5)),
                'active' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $customerIds = [];
        for ($c = 0; $c < self::N; $c++) {
            $customerIds[] = DB::table('customers')->insertGetId([
                'name' => $faker->name(),
                'email' => 'customer-'.Str::lower(Str::random(10)).'@dummy.local',
                'password' => $pw,
                'active' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $addressByCustomer = [];
        foreach ($customerIds as $cid) {
            $aid = DB::table('addresses')->insertGetId([
                'address_type' => 'Primary',
                'address_title' => 'Home',
                'address_line_1' => $faker->streetAddress(),
                'city' => $faker->city(),
                'state_id' => $stateId,
                'country_id' => $countryId,
                'zip_code' => (string) $faker->numberBetween(100000, 999999),
                'addressable_id' => $cid,
                'addressable_type' => Customer::class,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            $addressByCustomer[$cid] = $aid;
        }

        for ($o = 0; $o < self::N; $o++) {
            $cid = $customerIds[array_rand($customerIds)];
            $sid = $shopIds[array_rand($shopIds)];
            $qty = $faker->numberBetween(1, 5);
            $unit = $faker->randomFloat(2, 50, 2000);
            $grand = round($qty * $unit, 2);

            $oid = DB::table('orders')->insertGetId([
                'order_number' => 'DMY-'.$now->format('Ymd').'-'.Str::upper(Str::random(10)),
                'shop_id' => $sid,
                'customer_id' => $cid,
                'ship_to' => $addressByCustomer[$cid] ?? null,
                'item_count' => 1,
                'quantity' => $qty,
                'total' => $grand,
                'grand_total' => $grand,
                'payment_method_id' => $paymentMethodId,
                'payment_status' => 1,
                'order_status_id' => 1,
                'currency_id' => $currencyId,
                'email' => DB::table('customers')->where('id', $cid)->value('email'),
                'otp' => $faker->numerify('######'),
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $iid = $inventoryIds[array_rand($inventoryIds)];
            DB::table('order_items')->insert([
                'order_id' => $oid,
                'inventory_id' => $iid,
                'item_description' => $faker->sentence(8),
                'quantity' => $qty,
                'unit_price' => $unit,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->command?->info('DummyBulkSeeder: merchants/shops 10+10, products/inventories/customers/addresses/orders ×'.self::N.' (100+ total rows).');
    }
}
