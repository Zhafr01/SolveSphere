<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Partner extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'slug',
        'domain',
        'logo',
        'website',
        'description',
        'status',
        'user_id',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function news()
    {
        return $this->hasMany(News::class);
    }

    public function forumTopics()
    {
        return $this->hasMany(ForumTopic::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function latestSubscription()
    {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

    public function getLogoAttribute($value)
    {
        if (!$value) {
            return null;
        }
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        // Handle if value is already a storage path
        if (str_starts_with($value, '/storage/') || str_starts_with($value, 'storage/')) {
            return asset($value);
        }

        return asset('storage/' . str_replace('public/', '', $value));
    }

    public function getBannerAttribute($value)
    {
        if (!$value) {
            return null;
        }
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }
        
        // Handle if value is already a storage path
        if (str_starts_with($value, '/storage/') || str_starts_with($value, 'storage/')) {
            return asset($value);
        }

        return asset('storage/' . str_replace('public/', '', $value));
    }
    public function ratings()
    {
        return $this->hasMany(PartnerRating::class);
    }
}
