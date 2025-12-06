<?php

namespace App\Http\Controllers;

use App\Models\ForumComment;
use App\Models\ForumTopic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForumCommentController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/forum-topics/{forumTopic}/comments",
     *     summary="Add a comment to a forum topic",
     *     tags={"Forum"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="forumTopic",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"content"},
     *             @OA\Property(property="content", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Comment added successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="comment", type="object")
     *         )
     *     )
     * )
     */
    public function store(Request $request, $forumTopicId)
    {
        $forumTopic = ForumTopic::withoutGlobalScope(\App\Scopes\PartnerScope::class)->findOrFail($forumTopicId);

        $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:forum_comments,id', // Add validation for parent_id
        ]);

        $comment = $forumTopic->comments()->create([
            'content' => $request->content,
            'user_id' => Auth::id(),
            'parent_id' => $request->input('parent_id'), // Handle nested replies
            'partner_id' => $forumTopic->partner_id,
        ]);

        if ($request->input('parent_id')) {
            $parentComment = ForumComment::withoutGlobalScope(\App\Scopes\PartnerScope::class)->find($request->input('parent_id'));
            if ($parentComment && $parentComment->user_id !== Auth::id()) {
                $parentComment->user->notify(new \App\Notifications\NewReplyNotification($comment));
            }
        } elseif ($forumTopic->user_id !== Auth::id()) {
             $forumTopic->user->notify(new \App\Notifications\NewForumComment($comment));
        }

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/forum-topics/{forumTopic}/comments/{comment}",
     *     summary="Update a comment",
     *     tags={"Forum"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="forumTopic",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="comment",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"content"},
     *             @OA\Property(property="content", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Comment updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="comment", type="object")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $forumTopicId, $commentId)
    {
        $comment = ForumComment::withoutGlobalScope(\App\Scopes\PartnerScope::class)->findOrFail($commentId);
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update(['content' => $request->content]);

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $comment
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/forum-topics/{forumTopic}/comments/{comment}",
     *     summary="Delete a comment",
     *     tags={"Forum"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="forumTopic",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="comment",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Comment deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function destroy($forumTopicId, $commentId)
    {
        $comment = ForumComment::withoutGlobalScope(\App\Scopes\PartnerScope::class)->findOrFail($commentId);
        if ($comment->user_id !== Auth::id() && !Auth::user()->isSuperAdmin() && !Auth::user()->isPartnerAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }

    /**
     * @OA\Post(
     *     path="/api/comments/{comment}/like",
     *     summary="Like or unlike a comment",
     *     tags={"Forum"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="comment",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Like status toggled",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="liked", type="boolean")
     *         )
     *     )
     * )
     */
    public function like($commentId)
    {
        $comment = ForumComment::withoutGlobalScope(\App\Scopes\PartnerScope::class)->findOrFail($commentId);
        $user = Auth::user();

        if ($comment->likes()->where('user_id', $user->id)->exists()) {
            $comment->likes()->detach($user->id);
            $liked = false;
            $message = 'Unliked';
        } else {
            $comment->likes()->attach($user->id);
            $liked = true;
            $message = 'Liked';

            // Notify comment owner if not self
            if ($comment->user_id !== $user->id) {
                $comment->user->notify(new \App\Notifications\NewLikeNotification($user, 'comment', $comment));
            }
        }

        return response()->json([
            'message' => $message,
            'liked' => $liked,
            'likes_count' => $comment->likes()->count(),
        ]);
    }
}
