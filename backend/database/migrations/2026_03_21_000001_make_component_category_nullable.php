<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('components', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
        });

        Schema::table('components', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->change();
        });

        Schema::table('components', function (Blueprint $table) {
            $table->foreign('category_id')->references('id')->on('categories')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $fallbackCategoryId = DB::table('categories')->value('id');

        if ($fallbackCategoryId !== null) {
            DB::table('components')
                ->whereNull('category_id')
                ->update(['category_id' => $fallbackCategoryId]);
        }

        Schema::table('components', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
        });

        Schema::table('components', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable(false)->change();
        });

        Schema::table('components', function (Blueprint $table) {
            $table->foreign('category_id')->references('id')->on('categories')->cascadeOnDelete();
        });
    }
};
