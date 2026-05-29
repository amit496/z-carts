<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('shop_id')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->tinyInteger('rating')->default(5);
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->foreignId('inventory_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('shop_id');
            $table->unsignedBigInteger('dispute_type_id')->nullable();
            $table->text('description');
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
        });

        Schema::create('dispute_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('shop_id');
            $table->decimal('amount', 10, 2);
            $table->text('reason')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
        });

        Schema::create('cancellations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('cancellation_reason_id')->nullable();
            $table->text('reason')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->boolean('return_goods')->default(false);
            $table->timestamps();
        });

        Schema::create('cancellation_reasons', function (Blueprint $table) {
            $table->id();
            $table->string('reason');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shop_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->tinyInteger('customer_status')->default(1);
            $table->tinyInteger('shop_status')->default(1);
            $table->timestamps();
        });

        Schema::create('replies', function (Blueprint $table) {
            $table->id();
            $table->morphs('repliable');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->text('reply');
            $table->timestamps();
        });

        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shop_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->unsignedBigInteger('ticket_category_id')->nullable();
            $table->string('subject');
            $table->text('message');
            $table->tinyInteger('status')->default(1);
            $table->tinyInteger('priority')->default(2);
            $table->timestamps();
        });

        Schema::create('ticket_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_categories');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('replies');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('cancellation_reasons');
        Schema::dropIfExists('cancellations');
        Schema::dropIfExists('refunds');
        Schema::dropIfExists('dispute_types');
        Schema::dropIfExists('disputes');
        Schema::dropIfExists('wishlists');
        Schema::dropIfExists('feedbacks');
    }
};
