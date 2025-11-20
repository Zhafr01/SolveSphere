<?php

namespace App\Http\Controllers;

use App\Models\ForumComment;
use App\Models\ForumTopic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForumCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, ForumTopic $forumTopic)
    {
        $request->validate([
            'content' => 'required',
        ]);

        $comment = new ForumComment();
        $comment->user_id = Auth::id();
        $comment->topic_id = $forumTopic->id;
        $comment->content = $request->content;
        $comment->save();

        return redirect()->route('forum-topics.show', $forumTopic)->with('success', 'Comment added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
