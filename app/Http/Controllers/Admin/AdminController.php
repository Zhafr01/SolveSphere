<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Report;
use App\Models\ForumTopic;
use App\Models\News;

class AdminController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalReports = Report::count();
        $pendingReports = Report::where('status', 'pending')->count();
        $totalForumTopics = ForumTopic::count();
        $totalNews = News::count();

        return view('admin.index', compact(
            'totalUsers',
            'totalReports',
            'pendingReports',
            'totalForumTopics',
            'totalNews'
        ));
    }
}