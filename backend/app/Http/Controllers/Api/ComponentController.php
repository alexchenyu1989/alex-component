<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Component;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ComponentController extends Controller
{
    // 公開列表（前台）
    public function index(Request $request)
    {
        $query = Component::with(['category', 'tags'])
            ->where('is_published', true);

        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->tag) {
            $query->whereHas('tags', fn($q) => $q->where('slug', $request->tag));
        }

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->orderBy('sort_order', 'desc')->latest()->paginate(12));
    }

    // 公開單筆（前台）
    public function show(Component $component)
    {
        return response()->json($component->load(['category', 'tags']));
    }

    // 管理後台列表
    public function adminIndex(Request $request)
    {
        $query = Component::with(['category', 'tags'])
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
            'title'            => 'required|string|max:255',
            'preview_html'     => 'required|string',
            'markdown_content' => 'nullable|string',
            'category_id'      => 'nullable|exists:categories,id',
            'description'      => 'nullable|string',
            'prompt'           => 'nullable|string',
            'is_published'     => 'boolean',
            'sort_order'       => 'integer',
            'tags'             => 'array',
            'tags.*'           => 'exists:tags,id',
        ]);

        $component = Component::create([
            'title'            => $request->title,
            'slug'             => Str::slug($request->title) . '-' . Str::random(6),
            'description'      => $request->description,
            'preview_html'     => $request->preview_html,
            'markdown_content' => $request->markdown_content,
            'prompt'           => $request->prompt,
            'category_id'      => $request->category_id,
            'is_published'     => $request->is_published ?? true,
            'sort_order'       => $request->sort_order ?? 0,
        ]);

        if ($request->tags) {
            $component->tags()->sync($request->tags);
        }

        return response()->json($component->load(['category', 'tags']), 201);
    }

    // 更新
    public function update(Request $request, Component $component)
    {
        $request->validate([
            'title'            => 'sometimes|string|max:255',
            'preview_html'     => 'sometimes|string',
            'markdown_content' => 'sometimes|string',
            'category_id'      => 'sometimes|nullable|exists:categories,id',
            'description'      => 'nullable|string',
            'prompt'           => 'nullable|string',
            'is_published'     => 'boolean',
            'sort_order'       => 'integer',
            'tags'             => 'array',
            'tags.*'           => 'exists:tags,id',
        ]);

        $component->update($request->except('tags'));

        if ($request->has('tags')) {
            $component->tags()->sync($request->tags);
        }

        return response()->json($component->load(['category', 'tags']));
    }

    // 刪除
    public function destroy(Component $component)
    {
        $component->delete();

        return response()->json(['message' => '已刪除']);
    }
}
