<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ForumTopicController;
use App\Http\Controllers\ForumCommentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('reports', ReportController::class);
    Route::resource('forum-topics', ForumTopicController::class);
    Route::resource('forum-topics.comments', ForumCommentController::class)->shallow();
    Route::get('/news', [NewsController::class, 'index'])->name('news.index');
    Route::get('/news/create', [NewsController::class, 'create'])->name('news.create')->middleware('role:admin');
    Route::post('/news', [NewsController::class, 'store'])->name('news.store')->middleware('role:admin');
    Route::get('/news/{news}', [NewsController::class, 'show'])->name('news.show');
    Route::get('/news/{news}/edit', [NewsController::class, 'edit'])->name('news.edit')->middleware('role:admin');
    Route::put('/news/{news}', [NewsController::class, 'update'])->name('news.update')->middleware('role:admin');
    Route::delete('/news/{news}', [NewsController::class, 'destroy'])->name('news.destroy')->middleware('role:admin');
    Route::get('/admin', [App\Http\Controllers\Admin\AdminController::class, 'index'])->name('admin.index')->middleware('role:admin');
});

require __DIR__.'/auth.php';
