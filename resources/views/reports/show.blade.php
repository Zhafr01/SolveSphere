<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ $report->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <div class="flex items-start">
                        <div class="flex-1">
                            <div class="text-sm text-gray-600">
                                By <a href="#" class="text-blue-500 hover:underline">{{ $report->user->name }}</a>
                            </div>
                            <div class="text-sm text-gray-500">
                                {{ $report->created_at->diffForHumans() }}
                            </div>
                            <div class="mt-4">
                                <p class="text-lg font-semibold">Category: {{ $report->category }}</p>
                            </div>
                            <div class="mt-4">
                                <p>{{ $report->content }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
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

                    @if ($report->admin_note)
                        <div class="mt-6 p-4 bg-gray-100 rounded-lg">
                            <p class="text-sm font-semibold text-gray-800">Admin Note:</p>
                            <p class="text-sm text-gray-600">{{ $report->admin_note }}</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
