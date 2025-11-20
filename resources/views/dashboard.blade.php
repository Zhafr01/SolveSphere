<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Forum Topics -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-comments mr-2"></i> Latest Forum Topics</h3>
                        <ul>
                            @foreach($forumTopics as $topic)
                                <li class="mb-2"><a href="{{ route('forum-topics.show', $topic) }}" class="text-blue-500 hover:underline">{{ $topic->title }}</a></li>
                            @endforeach
                        </ul>
                    </div>
                </div>

                <!-- News -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-newspaper mr-2"></i> Latest News</h3>
                        <ul>
                            @foreach($news as $newsItem)
                                <li class="mb-2"><a href="{{ route('news.show', $newsItem) }}" class="text-blue-500 hover:underline">{{ $newsItem->title }}</a></li>
                            @endforeach
                        </ul>
                    </div>
                </div>

                <!-- Reports -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-flag mr-2"></i> Reports</h3>
                        <ul>
                            @foreach($reports as $report)
                                <li class="mb-2"><a href="{{ route('reports.show', $report) }}" class="text-blue-500 hover:underline">{{ $report->category }}</a></li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>