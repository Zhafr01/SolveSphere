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
                    @auth
                        @if(Auth::user()->role != 'admin')
                            <a href="{{ route('reports.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                                Create Report
                            </a>
                        @endif
                    @endauth
                    <div class="space-y-4">
                        @foreach ($reports as $report)
                            <div class="p-4 border rounded-lg shadow-sm">
                                <div class="flex items-start">
                                    <div class="flex-1">
                                        <div class="text-sm text-gray-600">
                                            By <a href="#" class="text-blue-500 hover:underline">{{ $report->user->name }}</a>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <h3 class="text-lg font-semibold">
                                                <a href="{{ route('reports.show', $report) }}" class="text-blue-500 hover:underline">{{ $report->title }}</a>
                                            </h3>
                                            <div class="text-sm text-gray-500">
                                                {{ $report->created_at->diffForHumans() }}
                                            </div>
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
                                        @if ($report->admin_note)
                                            <div class="mt-4 p-3 bg-gray-100 rounded-lg">
                                                <p class="text-sm font-semibold text-gray-800">Admin Note:</p>
                                                <p class="text-sm text-gray-600">{{ $report->admin_note }}</p>
                                            </div>
                                        @endif

                                        @auth
                                            @if(Auth::user()->role == 'admin')
                                                <form action="{{ route('reports.update', $report->id) }}" method="POST" class="mt-4">
                                                    @csrf
                                                    @method('PUT')
                                                    <div class="flex items-center space-x-4">
                                                        <div>
                                                            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                                                            <select id="status" name="status" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                                                <option value="pending" @if($report->status == 'pending') selected @endif>Pending</option>
                                                                <option value="in_progress" @if($report->status == 'in_progress') selected @endif>In Progress</option>
                                                                <option value="resolved" @if($report->status == 'resolved') selected @endif>Resolved</option>
                                                            </select>
                                                        </div>
                                                        <div class="flex-1">
                                                            <label for="admin_note" class="block text-sm font-medium text-gray-700">Admin Note</label>
                                                            <textarea id="admin_note" name="admin_note" rows="1" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">{{ $report->admin_note }}</textarea>
                                                        </div>
                                                        <div class="pt-5">
                                                            <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                                Update
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            @endif
                                        @endauth
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