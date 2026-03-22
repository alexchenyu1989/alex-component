<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    // 公開列表（前台）
    public function index(Request $request)
    {
        $query = Article::with('category')
            ->where('is_published', true);

        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        return response()->json(
            $query->orderBy('sort_order', 'desc')->latest()->paginate(12)
        );
    }

    // 公開單筆（前台）
    public function show(Article $article)
    {
        abort_if(!$article->is_published, 404);
        return response()->json($article->load('category'));
    }

    // 後台列表
    public function adminIndex(Request $request)
    {
        $query = Article::with('category')
            ->orderBy('sort_order', 'desc')
            ->latest();

        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        return response()->json($query->paginate(20));
    }

    // 新增
    public function store(Request $request)
    {
        $request->validate([
            'title'               => 'required|string|max:255',
            'content'             => 'required|string',
            'excerpt'             => 'nullable|string',
            'article_category_id' => 'nullable|exists:article_categories,id',
            'is_published'        => 'boolean',
            'sort_order'          => 'integer',
        ]);

        $article = Article::create([
            'title'               => $request->title,
            'slug'                => Str::slug($request->title) . '-' . Str::random(6),
            'excerpt'             => $request->excerpt,
            'content'             => $request->content,
            'article_category_id' => $request->article_category_id,
            'is_published'        => $request->is_published ?? true,
            'sort_order'          => $request->sort_order ?? 0,
        ]);

        return response()->json($article->load('category'), 201);
    }

    // 更新
    public function update(Request $request, Article $article)
    {
        $request->validate([
            'title'               => 'sometimes|string|max:255',
            'content'             => 'sometimes|string',
            'excerpt'             => 'nullable|string',
            'article_category_id' => 'nullable|exists:article_categories,id',
            'is_published'        => 'boolean',
            'sort_order'          => 'integer',
        ]);

        $article->update($request->all());

        return response()->json($article->load('category'));
    }

    // 刪除
    public function destroy(Article $article)
    {
        $article->delete();
        return response()->json(['message' => '已刪除']);
    }
}
