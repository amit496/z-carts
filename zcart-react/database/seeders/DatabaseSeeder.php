<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Shop;
use App\Models\Config;
use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\CategorySubGroup;
use App\Models\Manufacturer;
use App\Models\Product;
use App\Models\Inventory;
use App\Models\PaymentMethod;
use App\Models\SubscriptionPlan;
use App\Models\Banner;
use App\Models\Slider;
use App\Models\Faq;
use App\Models\FaqTopic;
use App\Models\Page;
use App\Models\Currency;
use App\Models\Tax;
use App\Models\ShippingZone;
use App\Models\ShippingRate;
use App\Models\Carrier;
use App\Models\Coupon;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Roles
        $superAdmin = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'level' => 1]);
        $admin      = Role::create(['name' => 'Admin',       'slug' => 'admin',       'level' => 2]);
        $merchant   = Role::create(['name' => 'Merchant',    'slug' => 'merchant',    'level' => 3]);

        // Admin user
        $adminUser = User::create([
            'name'     => 'Admin',
            'email'    => 'admin@zcart.com',
            'password' => bcrypt('admin123'),
            'role_id'  => $superAdmin->id,
            'active'   => true,
        ]);

        // Merchant Users
        $merchant1 = User::create([
            'name'     => 'John Merchant',
            'email'    => 'merchant@zcart.com',
            'password' => bcrypt('merchant123'),
            'role_id'  => $merchant->id,
            'phone'    => '+1234567890',
            'active'   => true,
        ]);

        $merchant2 = User::create([
            'name'     => 'Sarah Seller',
            'email'    => 'seller@zcart.com',
            'password' => bcrypt('seller123'),
            'role_id'  => $merchant->id,
            'phone'    => '+1234567891',
            'active'   => true,
        ]);

        $merchant3 = User::create([
            'name'     => 'Mike Store',
            'email'    => 'mike@zcart.com',
            'password' => bcrypt('mike123'),
            'role_id'  => $merchant->id,
            'phone'    => '+1234567892',
            'active'   => true,
        ]);

        // Currency
        Currency::create(['name' => 'US Dollar', 'iso_code' => 'USD', 'symbol' => '$', 'exchange_rate' => 1, 'active' => true]);

        // Payment Methods
        foreach ([['Cash on Delivery','cod','manual'],['Stripe','stripe','online'],['PayPal','paypal','online']] as [$name,$code,$type]) {
            PaymentMethod::create(['name' => $name, 'code' => $code, 'type' => $type, 'active' => true]);
        }

        // Subscription Plans
        SubscriptionPlan::create(['name' => 'Basic', 'plan_id' => 'basic', 'price' => 29, 'interval' => 'month', 'inventory_limit' => 100, 'team_size' => 3]);
        SubscriptionPlan::create(['name' => 'Pro',   'plan_id' => 'pro',   'price' => 79, 'interval' => 'month', 'inventory_limit' => 500, 'team_size' => 10]);

        // Category Groups & Categories
        $group = CategoryGroup::create(['name' => 'Electronics', 'slug' => 'electronics', 'active' => true]);
        $subGroup = CategorySubGroup::create(['category_group_id' => $group->id, 'name' => 'Phones & Tablets', 'slug' => 'phones-tablets', 'active' => true]);
        $cat1 = Category::create(['category_sub_group_id' => $subGroup->id, 'name' => 'Smartphones', 'slug' => 'smartphones', 'active' => true]);
        $cat2 = Category::create(['category_sub_group_id' => $subGroup->id, 'name' => 'Tablets',     'slug' => 'tablets',     'active' => true]);

        $group2 = CategoryGroup::create(['name' => 'Fashion', 'slug' => 'fashion', 'active' => true]);
        $subGroup2 = CategorySubGroup::create(['category_group_id' => $group2->id, 'name' => 'Clothing', 'slug' => 'clothing', 'active' => true]);
        $cat3 = Category::create(['category_sub_group_id' => $subGroup2->id, 'name' => "Men's Wear",   'slug' => 'mens-wear',   'active' => true]);
        $cat4 = Category::create(['category_sub_group_id' => $subGroup2->id, 'name' => "Women's Wear", 'slug' => 'womens-wear', 'active' => true]);

        // Manufacturers
        $mfr = Manufacturer::create(['name' => 'TechBrand', 'slug' => 'techbrand', 'active' => true]);
        $mfr2 = Manufacturer::create(['name' => 'FashionHub', 'slug' => 'fashionhub', 'active' => true]);
        $mfr3 = Manufacturer::create(['name' => 'HomeGoods', 'slug' => 'homegoods', 'active' => true]);

        // Shops
        $shop = Shop::create([
            'owner_id'        => $adminUser->id,
            'name'            => 'zCart Official Store',
            'slug'            => 'zcart-official',
            'email'           => 'store@zcart.com',
            'description'     => 'The official zCart demo store.',
            'active'          => true,
            'id_verified'     => true,
            'phone_verified'  => true,
            'address_verified'=> true,
            'current_billing_plan' => 'pro',
        ]);
        Config::create(['shop_id' => $shop->id, 'maintenance_mode' => false, 'active_ecommerce' => true]);

        $shop2 = Shop::create([
            'owner_id'        => $merchant1->id,
            'name'            => 'Tech Paradise',
            'slug'            => 'tech-paradise',
            'email'           => 'contact@techparadise.com',
            'description'     => 'Your one-stop shop for all tech gadgets.',
            'active'          => true,
            'id_verified'     => true,
            'phone_verified'  => true,
            'address_verified'=> true,
            'current_billing_plan' => 'basic',
        ]);
        Config::create(['shop_id' => $shop2->id, 'maintenance_mode' => false, 'active_ecommerce' => true]);

        $shop3 = Shop::create([
            'owner_id'        => $merchant2->id,
            'name'            => 'Fashion Trends',
            'slug'            => 'fashion-trends',
            'email'           => 'hello@fashiontrends.com',
            'description'     => 'Latest fashion trends and styles.',
            'active'          => true,
            'id_verified'     => true,
            'phone_verified'  => true,
            'address_verified'=> true,
            'current_billing_plan' => 'pro',
        ]);
        Config::create(['shop_id' => $shop3->id, 'maintenance_mode' => false, 'active_ecommerce' => true]);

        $shop4 = Shop::create([
            'owner_id'        => $merchant3->id,
            'name'            => 'Home Essentials',
            'slug'            => 'home-essentials',
            'email'           => 'info@homeessentials.com',
            'description'     => 'Everything you need for your home.',
            'active'          => true,
            'id_verified'     => false,
            'phone_verified'  => true,
            'address_verified'=> false,
            'current_billing_plan' => 'basic',
        ]);
        Config::create(['shop_id' => $shop4->id, 'maintenance_mode' => false, 'active_ecommerce' => true]);

        // Tax & Shipping for all shops
        foreach ([$shop, $shop2, $shop3, $shop4] as $s) {
            Tax::create(['shop_id' => $s->id, 'name' => 'VAT 10%', 'rate' => 10, 'active' => true]);
            $zone = ShippingZone::create(['shop_id' => $s->id, 'name' => 'Worldwide', 'active' => true]);
            ShippingRate::create(['shipping_zone_id' => $zone->id, 'name' => 'Standard', 'rate' => 5.00, 'active' => true]);
            ShippingRate::create(['shipping_zone_id' => $zone->id, 'name' => 'Express',  'rate' => 15.00, 'active' => true]);
            Carrier::create(['shop_id' => $s->id, 'name' => 'FedEx', 'tracking_url' => 'https://fedex.com/track/@', 'active' => true]);
        }

        // Products & Inventories - Shop 1 (Admin)
        $products = [
            [$shop, 'iPhone 15 Pro', 'iphone-15-pro', 999, $cat1->id, $mfr->id],
            [$shop, 'Samsung Galaxy S24', 'samsung-galaxy-s24', 849, $cat1->id, $mfr->id],
            [$shop, 'iPad Air', 'ipad-air', 599, $cat2->id, $mfr->id],
            [$shop, 'Classic T-Shirt', 'classic-t-shirt', 29, $cat3->id, $mfr2->id],
            [$shop, 'Summer Dress', 'summer-dress', 49, $cat4->id, $mfr2->id],
            [$shop, 'Wireless Earbuds', 'wireless-earbuds', 79, $cat1->id, $mfr->id],
            
            // Shop 2 (Merchant 1) - Tech Products
            [$shop2, 'MacBook Pro M3', 'macbook-pro-m3', 1999, $cat1->id, $mfr->id],
            [$shop2, 'AirPods Pro', 'airpods-pro', 249, $cat1->id, $mfr->id],
            [$shop2, 'Smart Watch', 'smart-watch', 399, $cat1->id, $mfr->id],
            [$shop2, 'Gaming Laptop', 'gaming-laptop', 1499, $cat1->id, $mfr->id],
            [$shop2, 'Bluetooth Speaker', 'bluetooth-speaker', 89, $cat1->id, $mfr->id],
            
            // Shop 3 (Merchant 2) - Fashion
            [$shop3, 'Denim Jacket', 'denim-jacket', 79, $cat3->id, $mfr2->id],
            [$shop3, 'Casual Sneakers', 'casual-sneakers', 59, $cat3->id, $mfr2->id],
            [$shop3, 'Evening Gown', 'evening-gown', 149, $cat4->id, $mfr2->id],
            [$shop3, 'Leather Handbag', 'leather-handbag', 199, $cat4->id, $mfr2->id],
            [$shop3, 'Sunglasses', 'sunglasses', 39, $cat3->id, $mfr2->id],
            
            // Shop 4 (Merchant 3) - Home
            [$shop4, 'Coffee Maker', 'coffee-maker', 89, $cat1->id, $mfr3->id],
            [$shop4, 'Bed Sheets Set', 'bed-sheets-set', 49, $cat4->id, $mfr3->id],
            [$shop4, 'Wall Clock', 'wall-clock', 29, $cat1->id, $mfr3->id],
            [$shop4, 'Table Lamp', 'table-lamp', 39, $cat1->id, $mfr3->id],
        ];

        foreach ($products as [$shopObj, $name, $slug, $price, $catId, $mfrId]) {
            $product = Product::create([
                'shop_id'         => $shopObj->id,
                'manufacturer_id' => $mfrId,
                'name'            => $name,
                'slug'            => $slug,
                'description'     => "High quality {$name} available at great price.",
                'min_price'       => $price,
                'active'          => true,
            ]);
            $product->categories()->attach($catId);

            Inventory::create([
                'shop_id'        => $shopObj->id,
                'product_id'     => $product->id,
                'title'          => $name,
                'slug'           => $slug . '-inv',
                'sku'            => strtoupper(Str::random(8)),
                'sale_price'     => $price,
                'stock_quantity' => rand(50, 200),
                'active'         => true,
                'available_from' => now(),
            ]);
        }

        // Coupons
        Coupon::create(['code' => 'WELCOME10', 'type' => 'percentage', 'value' => 10, 'active' => true, 'ending_time' => now()->addYear()]);
        Coupon::create(['code' => 'SAVE20', 'type' => 'percentage', 'value' => 20, 'active' => true, 'ending_time' => now()->addMonths(6)]);
        Coupon::create(['code' => 'FLAT50', 'type' => 'fixed', 'value' => 50, 'active' => true, 'ending_time' => now()->addMonths(3)]);

        // Customers
        $customer1 = Customer::create([
            'name'     => 'Alice Johnson',
            'email'    => 'alice@example.com',
            'password' => bcrypt('customer123'),
            'phone'    => '+1234567893',
            'active'   => true,
        ]);

        $customer2 = Customer::create([
            'name'     => 'Bob Smith',
            'email'    => 'bob@example.com',
            'password' => bcrypt('customer123'),
            'phone'    => '+1234567894',
            'active'   => true,
        ]);

        $customer3 = Customer::create([
            'name'     => 'Carol White',
            'email'    => 'carol@example.com',
            'password' => bcrypt('customer123'),
            'phone'    => '+1234567895',
            'active'   => true,
        ]);

        // Sliders
        Slider::create(['title' => 'Welcome to zCart', 'image' => 'https://placehold.co/1200x400/6366f1/white?text=zCart+Marketplace', 'active' => true, 'order' => 1]);
        Slider::create(['title' => 'Shop the Best Deals', 'image' => 'https://placehold.co/1200x400/8b5cf6/white?text=Best+Deals', 'active' => true, 'order' => 2]);

        // Banners
        Banner::create(['title' => 'Electronics Sale', 'image' => 'https://placehold.co/600x200/6366f1/white?text=Electronics', 'group' => 'home', 'active' => true]);
        Banner::create(['title' => 'Fashion Week',     'image' => 'https://placehold.co/600x200/ec4899/white?text=Fashion',     'group' => 'home', 'active' => true]);

        // FAQs
        $topic = FaqTopic::create(['name' => 'Orders', 'active' => true]);
        Faq::create(['faq_topic_id' => $topic->id, 'question' => 'How do I track my order?', 'answer' => 'You can track your order from the My Orders section in your account.', 'active' => true]);
        Faq::create(['faq_topic_id' => $topic->id, 'question' => 'Can I cancel my order?', 'answer' => 'Yes, you can cancel your order before it is fulfilled.', 'active' => true]);

        // Pages
        Page::create(['title' => 'About Us',       'slug' => 'about',   'content' => '<p>Welcome to zCart, your trusted marketplace.</p>', 'active' => true]);
        Page::create(['title' => 'Privacy Policy', 'slug' => 'privacy', 'content' => '<p>Your privacy is important to us.</p>',            'active' => true]);
        Page::create(['title' => 'Terms of Use',   'slug' => 'terms',   'content' => '<p>By using zCart you agree to our terms.</p>',      'active' => true]);
    }
}
