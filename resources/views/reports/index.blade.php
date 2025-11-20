<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Reports') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <a href="{{ route('reports.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                        Create Report
                    </a>
                    <div class="space-y-4">
                        @foreach ($reports as $report)
                            <div class="p-4 border rounded-lg shadow-sm">
                                <div class="flex items-start">
                                    <div class="flex-1">
                                        <div class="flex justify-between items-center">
                                            <h3 class="text-lg font-semibold">
                                                <a href="{{ route('reports.show', $report) }}" class="text-blue-500 hover:underline">{{ $report->title }}</a>
                                            </h3>
                                            <div class="text-sm text-gray-500">
                                                {{ $report->created_at->diffForHumans() }}
                                            </div>
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            By <a href="#" class="text-blue-500 hover:underline">{{ $report->user->name }}</a>
                                        </div>
                                        <div class="mt-2">
                                            <span class="text-sm font-semibold">Category:</span> {{ $report->category }}
                                        </div>
                                        <div class="mt-2">
                                            @php
                                                $statusClass = '';
                                                if ($report->status === 'pending') {
                                                    $statusClass = 'bg-yellow-200 text-yellow-800';
                                                } elseif ($report->status === 'in_progress') {
                                                    $statusClass = 'bg-blue-200 text-blue-800';
                                                } elseif ($report->status === 'resolved') {
                                                    $statusClass = 'bg-green-200 text-green-800';
                                                }
                                            @endphp
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $statusClass }}">
                                                {{ $report->status }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>