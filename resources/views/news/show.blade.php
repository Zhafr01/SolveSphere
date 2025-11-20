<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ $news->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <div class="flex items-start">
                        <img src="https://i.pravatar.cc/50?u={{ $news->user->email }}" alt="avatar" class="rounded-full mr-4">
                        <div class="flex-1">
                            <p>{{ $news->content }}</p>
                            <p class="text-sm text-gray-500">By <a href="#" class="text-blue-500 hover:underline">{{ $news->user->name }}</a> on {{ $news->created_at->format('M d, Y') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>