<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ComponentController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\ArticleCategoryController;

// 公開路由（前台使用）
Route::get('/components', [ComponentController::class, 'index']);
Route::get('/components/{component:slug}', [ComponentController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/tags', [TagController::class, 'index']);

// 文章公開路由
Route::get('/article-categories', [ArticleCategoryController::class, 'index']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{article:slug}', [ArticleController::class, 'show']);

// 管理員登入
Route::post('/admin/login', [AuthController::class, 'login']);

// 需要登入的管理後台路由
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/me', [AuthController::class, 'me']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);

    // 元件管理
    Route::get('/admin/components', [ComponentController::class, 'adminIndex']);
    Route::post('/admin/components', [ComponentController::class, 'store']);
    Route::put('/admin/components/{component}', [ComponentController::class, 'update']);
    Route::delete('/admin/components/{component}', [ComponentController::class, 'destroy']);

    // 分類管理
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::put('/admin/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy']);

    // 標籤管理
    Route::post('/admin/tags', [TagController::class, 'store']);
    Route::put('/admin/tags/{tag}', [TagController::class, 'update']);
    Route::delete('/admin/tags/{tag}', [TagController::class, 'destroy']);

    // 文章分類管理
    Route::post('/admin/article-categories', [ArticleCategoryController::class, 'store']);
    Route::put('/admin/article-categories/{articleCategory}', [ArticleCategoryController::class, 'update']);
    Route::delete('/admin/article-categories/{articleCategory}', [ArticleCategoryController::class, 'destroy']);

    // 文章管理
    Route::get('/admin/articles', [ArticleController::class, 'adminIndex']);
    Route::post('/admin/articles', [ArticleController::class, 'store']);
    Route::put('/admin/articles/{article}', [ArticleController::class, 'update']);
    Route::delete('/admin/articles/{article}', [ArticleController::class, 'destroy']);
});
