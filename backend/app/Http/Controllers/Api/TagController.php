<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{
    private function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);

        if ($baseSlug === '') {
            $baseSlug = 'tag';
        }

        $slug = $baseSlug;
        $counter = 2;

        while (
            Tag::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    public function index()
    {
        return response()->json(Tag::all());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $tag = Tag::create([
            'name' => $request->name,
            'slug' => $this->generateUniqueSlug($request->name),
        ]);

        return response()->json($tag, 201);
    }

    public function update(Request $request, Tag $tag)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $tag->update([
            'name' => $request->name,
            'slug' => $this->generateUniqueSlug($request->name, $tag->id),
        ]);

        return response()->json($tag);
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return response()->json(['message' => '已刪除']);
    }
}
