<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Report;
use App\Models\ForumTopic;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $news = News::latest()->take(5)->get();
        $forumTopics = ForumTopic::latest()->take(5)->get();
        $reports = Report::all();

        return view('dashboard', compact('news', 'forumTopics', 'reports'));
    }
}