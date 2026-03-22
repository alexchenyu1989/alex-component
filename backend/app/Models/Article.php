<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'article_category_id',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'sort_order'   => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(ArticleCategory::class, 'article_category_id');
    }
}
