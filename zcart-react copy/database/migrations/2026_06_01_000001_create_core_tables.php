<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->integer('level')->nullable();
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('role_permission', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->constrained()->nullOnDelete();
            $table->string('phone')->nullable();
            $table->boolean('active')->default(true);
            $table->string('fcm_token')->nullable();
            $table->string('api_key')->nullable();
            $table->softDeletes();
        });

        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('nice_name')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password');
            $table->date('dob')->nullable();
            $table->string('sex')->nullable();
            $table->text('description')->nullable();
            $table->boolean('active')->default(true);
            $table->boolean('approval_status')->default(true);
            $table->boolean('accepts_marketing')->nullable();
            $table->string('verification_token')->nullable();
            $table->string('remember_token')->nullable();
            $table->string('fcm_token')->nullable();
            $table->timestamp('last_visited_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('legal_name')->nullable();
            $table->string('email')->nullable();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('external_url')->nullable();
            $table->boolean('active')->default(false);
            $table->boolean('id_verified')->default(false);
            $table->boolean('phone_verified')->default(false);
            $table->boolean('address_verified')->default(false);
            $table->boolean('payment_verified')->default(false);
            $table->string('current_billing_plan')->nullable();
            $table->decimal('commission_rate', 5, 2)->nullable();
            $table->unsignedBigInteger('total_item_sold')->default(0);
            $table->decimal('total_sold_amount', 12, 2)->default(0);
            $table->string('pay_to')->nullable();
            $table->json('extra_info')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->cascadeOnDelete();
            $table->boolean('maintenance_mode')->default(false);
            $table->boolean('active_ecommerce')->default(true);
            $table->boolean('pickup_enabled')->default(false);
            $table->unsignedBigInteger('order_invoice_pdf_template')->nullable();
            $table->unsignedBigInteger('shipping_label_pdf_template')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configs');
        Schema::dropIfExists('shops');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('role_permission');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
