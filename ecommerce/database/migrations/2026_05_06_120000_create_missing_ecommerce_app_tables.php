<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('product_variants')) {
            Schema::create('product_variants', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->string('sku')->nullable();
                $table->string('size')->nullable();
                $table->string('color')->nullable();
                $table->decimal('price', 12, 2)->nullable();
                $table->unsignedInteger('stock')->default(0);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('product_images')) {
            Schema::create('product_images', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->string('image');
                $table->boolean('is_primary')->default(false);
                $table->unsignedInteger('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('user_cart_items')) {
            Schema::create('user_cart_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
                $table->unsignedInteger('quantity')->default(1);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('flash_sales')) {
            Schema::create('flash_sales', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->unique()->constrained('products')->cascadeOnDelete();
                $table->decimal('sale_price', 12, 2);
                $table->unsignedInteger('quantity')->default(0);
                $table->unsignedInteger('sold')->default(0);
                $table->dateTime('starts_at');
                $table->dateTime('ends_at');
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
                $table->unsignedTinyInteger('rating');
                $table->text('comment')->nullable();
                $table->boolean('is_verified')->default(false);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('chats')) {
            Schema::create('chats', function (Blueprint $table) {
                $table->id();
                $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
                $table->unsignedBigInteger('store_id');
                $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
                $table->timestamp('last_message_at')->nullable();
                $table->timestamps();
                $table->unique(['buyer_id', 'store_id']);
                $table->foreign('store_id')->references('id')->on('shops')->cascadeOnDelete();
            });
        }

        if (! Schema::hasTable('chat_messages')) {
            Schema::create('chat_messages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('chat_id')->constrained('chats')->cascadeOnDelete();
                $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
                $table->text('message');
                $table->boolean('is_read')->default(false);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('catalog_attributes')) {
            Schema::create('catalog_attributes', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('type');
                $table->unsignedInteger('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('catalog_attribute_values')) {
            Schema::create('catalog_attribute_values', function (Blueprint $table) {
                $table->id();
                $table->foreignId('catalog_attribute_id')->constrained('catalog_attributes')->cascadeOnDelete();
                $table->string('value');
                $table->unsignedInteger('sort_order')->default(0);
                $table->string('image')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('catalog_attribute_category')) {
            Schema::create('catalog_attribute_category', function (Blueprint $table) {
                $table->foreignId('catalog_attribute_id')->constrained('catalog_attributes')->cascadeOnDelete();
                $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
                $table->primary(['catalog_attribute_id', 'category_id']);
            });
        }

        if (! Schema::hasTable('coupon_usages')) {
            Schema::create('coupon_usages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('coupon_id')->constrained('coupons')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
                $table->timestamps();
            });
        }

        Schema::table('order_items', function (Blueprint $table) {
            if (! Schema::hasColumn('order_items', 'product_id')) {
                $table->unsignedBigInteger('product_id')->nullable()->index();
            }
            if (! Schema::hasColumn('order_items', 'variant_id')) {
                $table->unsignedBigInteger('variant_id')->nullable()->index();
            }
            if (! Schema::hasColumn('order_items', 'product_name')) {
                $table->string('product_name')->nullable();
            }
            if (! Schema::hasColumn('order_items', 'size')) {
                $table->string('size')->nullable();
            }
            if (! Schema::hasColumn('order_items', 'color')) {
                $table->string('color')->nullable();
            }
            if (! Schema::hasColumn('order_items', 'price')) {
                $table->decimal('price', 12, 2)->nullable();
            }
        });

        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'store_id')) {
                $table->unsignedBigInteger('store_id')->nullable()->index();
            }
            if (! Schema::hasColumn('products', 'price')) {
                $table->decimal('price', 12, 2)->nullable();
            }
            if (! Schema::hasColumn('products', 'compare_price')) {
                $table->decimal('compare_price', 12, 2)->nullable();
            }
            if (! Schema::hasColumn('products', 'category_id')) {
                $table->unsignedBigInteger('category_id')->nullable()->index();
            }
            if (! Schema::hasColumn('products', 'stock')) {
                $table->unsignedInteger('stock')->nullable();
            }
            if (! Schema::hasColumn('products', 'is_featured')) {
                $table->boolean('is_featured')->default(false);
            }
            if (! Schema::hasColumn('products', 'is_active')) {
                $table->boolean('is_active')->default(true);
            }
            if (! Schema::hasColumn('products', 'material')) {
                $table->string('material')->nullable();
            }
            if (! Schema::hasColumn('products', 'gender')) {
                $table->string('gender')->nullable();
            }
            if (! Schema::hasColumn('products', 'rating')) {
                $table->decimal('rating', 3, 2)->nullable();
            }
            if (! Schema::hasColumn('products', 'reviews_count')) {
                $table->unsignedInteger('reviews_count')->default(0);
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupon_usages');
        Schema::dropIfExists('catalog_attribute_category');
        Schema::dropIfExists('catalog_attribute_values');
        Schema::dropIfExists('catalog_attributes');
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chats');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('flash_sales');
        Schema::dropIfExists('user_cart_items');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('product_variants');

        Schema::table('products', function (Blueprint $table) {
            foreach ([
                'reviews_count', 'rating', 'gender', 'material', 'is_active', 'is_featured',
                'stock', 'category_id', 'compare_price', 'price', 'store_id',
            ] as $col) {
                if (Schema::hasColumn('products', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            foreach (['price', 'color', 'size', 'product_name', 'variant_id', 'product_id'] as $col) {
                if (Schema::hasColumn('order_items', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
