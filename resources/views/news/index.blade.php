<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('News') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    @if (auth()->user()->role === 'admin')
                    <a href="{{ route('news.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                        Create News
                    </a>
                    @endif
                    <div class="space-y-4">
                        @foreach ($news as $news_item)
                            <div class="p-4 border rounded-lg shadow-sm">
                                <div class="flex items-start">
                                    <img src="https://i.pravatar.cc/50?u={{ $news_item->admin->email }}" alt="avatar" class="rounded-full mr-4">
                                    <div class="flex-1">
                                        <div class="text-sm text-gray-600">
                                            By <a href="#" class="text-blue-500 hover:underline">{{ $news_item->admin->name }}</a>
                                            <span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                Admin
                                            </span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <h3 class="text-lg font-semibold">
                                                <a href="{{ route('news.show', $news_item) }}" class="text-blue-500 hover:underline">{{ $news_item->title }}</a>
                                            </h3>
                                            <div class="text-sm text-gray-500">
                                                {{ $news_item->created_at->diffForHumans() }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
            <div class="mt-4">
                {{ $news->links() }}
            </div>
        </div>
    </div>
</x-app-layout>