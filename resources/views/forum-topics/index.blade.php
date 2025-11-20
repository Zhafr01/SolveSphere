<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Forum') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <a href="{{ route('forum-topics.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                        Create Topic
                    </a>
                    <div class="space-y-4">
                        @foreach ($topics as $topic)
                            <div class="p-4 border rounded-lg shadow-sm">
                                <div class="flex items-start">
                                    <img src="https://i.pravatar.cc/50?u={{ $topic->user->email }}" alt="avatar" class="rounded-full mr-4">
                                    <div class="flex-1">
                                        <div class="flex justify-between items-center">
                                            <h3 class="text-lg font-semibold">
                                                <a href="{{ route('forum-topics.show', $topic) }}" class="text-blue-500 hover:underline">{{ $topic->title }}</a>
                                            </h3>
                                            <div class="text-sm text-gray-500">
                                                {{ $topic->created_at->diffForHumans() }}
                                            </div>
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            By <a href="#" class="text-blue-500 hover:underline">{{ $topic->user->name }}</a>
                                        </div>
                                    </div>
                                    <div class="ml-4 text-sm text-gray-500 text-center">
                                        <div>{{ $topic->comments->count() }}</div>
                                        <div>replies</div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
            <div class="mt-4">
                {{ $topics->links() }}
            </div>
        </div>
    </div>
</x-app-layout>