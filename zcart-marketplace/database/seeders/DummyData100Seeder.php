<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DummyData100Seeder extends Seeder
{
    public function run(): void
    {
        /**
         * This seeder is meant to be safe to run on an existing DB.
         * It only seeds minimum prerequisites when the tables are empty.
         */
        if (DB::table('timezones')->count() === 0) {
            $this->call(TimezonesSeeder::class);
        }

        if (DB::table('currencies')->count() === 0) {
            $this->call(CurrenciesSeeder::class);
        }

        if (DB::table('countries')->count() === 0) {
            $this->call(CountriesSeeder::class);
        }

        if (DB::table('states')->count() === 0) {
            $this->call(StatesSeeder::class);
        }

        if (DB::table('roles')->count() === 0) {
            $this->call(RolesSeeder::class);
        }

        if (!DB::table('users')->where('id', 1)->exists()) {
            $this->call(UsersSeeder::class);
        }

        // Category group / subgroup / category (100 each)
        \App\Models\CategoryGroup::factory()->count(100)->create();
        \App\Models\CategorySubGroup::factory()->count(100)->create();
        \App\Models\Category::factory()->count(100)->create();

        // Customers (100) + addresses (Primary/Billing/Shipping)
        \App\Models\Customer::factory()
            ->count(100)
            ->create()
            ->each(function ($customer) {
                $customer->addresses()->save(
                    \App\Models\Address::factory()->make([
                        'address_title' => $customer->name,
                        'address_type' => 'Primary',
                    ])
                );
                $customer->addresses()->save(\App\Models\Address::factory()->make(['address_type' => 'Billing']));
                $customer->addresses()->save(\App\Models\Address::factory()->make(['address_type' => 'Shipping']));
            });
    }
}

