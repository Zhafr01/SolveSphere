<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\ForumComment;

class NewReplyNotification extends Notification
{
    use Queueable;

    public function __construct(public ForumComment $reply)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'topic_id' => $this->reply->topic_id,
            'title' => $this->reply->topic->title,
            'message' => 'Someone replied to your comment on "' . $this->reply->topic->title . '".',
            'comment_id' => $this->reply->id,
        ];
    }
}
