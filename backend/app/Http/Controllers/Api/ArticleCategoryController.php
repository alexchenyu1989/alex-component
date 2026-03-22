<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArticleCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleCategoryController extends Controller
{
    private function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $counter = 1;

        while (
            ArticleCategory::where('slug', $slug)
                ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $base . '-' . $counter++;
        }

        return $slug;
    }

    public function index()
    {
        return response()->json(ArticleCategory::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $category = ArticleCategory::create([
            'name' => $request->name,
            'slug' => $this->generateUniqueSlug($request->name),
        ]);

        return response()->json($category, 201);
    }

    public function update(Request $request, ArticleCategory $articleCategory)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $articleCategory->update([
            'name' => $request->name,
            'slug' => $this->generateUniqueSlug($request->name, $articleCategory->id),
        ]);

        return response()->json($articleCategory);
    }

    public function destroy(ArticleCategory $articleCategory)
    {
        $articleCategory->delete();
        return response()->json(['message' => '已刪除']);
    }
}
