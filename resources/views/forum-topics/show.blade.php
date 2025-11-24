<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ $forumTopic->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <div class="flex items-start">
                        <img src="https://i.pravatar.cc/50?u={{ $forumTopic->user->email }}" alt="avatar" class="rounded-full mr-4">
                        <div class="flex-1">
                            <p class="mt-2">{{ $forumTopic->content }}</p>
                            <p class="text-sm text-gray-500">By <a href="#" class="text-blue-500 hover:underline">{{ $forumTopic->user->name }}</a>
                                @if ($forumTopic->user->role === 'admin')
                                    <span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        Admin
                                    </span>
                                @endif
                                on {{ $forumTopic->created_at->format('M d, Y') }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <h3 class="text-lg font-semibold">Comments</h3>
                @foreach ($forumTopic->comments as $comment)
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-4">
                        <div class="p-6 bg-white border-b border-gray-200">
                            <div class="flex items-start">
                                <img src="https://i.pravatar.cc/50?u={{ $comment->user->email }}" alt="avatar" class="rounded-full mr-4">
                                <div class="flex-1">
                                    <p class="mt-2">{{ $comment->content }}</p>
                                     <p class="text-sm text-gray-500">By <a href="#" class="text-blue-500 hover:underline">{{ $comment->user->name }}</a>
                                        @if ($comment->user->role === 'admin')
                                            <span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                Admin
                                            </span>
                                        @endif
                                        on {{ $comment->created_at->format('M d, Y') }}</p>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="mt-8">
                <form action="{{ route('forum-topics.comments.store', $forumTopic) }}" method="POST">
                    @csrf
                    <div class="mb-4">
                        <label for="content" class="block text-gray-700 text-sm font-bold mb-2">Add a comment</label>
                        <textarea name="content" id="content" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </div>
                    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>