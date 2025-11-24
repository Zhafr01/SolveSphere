<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Admin Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h3 class="text-lg font-semibold mb-4">Overview</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="bg-blue-100 p-4 rounded-lg shadow-sm">
                            <h4 class="font-medium text-blue-800">Total Users</h4>
                            <p class="text-2xl font-bold text-blue-900">{{ $totalUsers }}</p>
                        </div>
                        <div class="bg-green-100 p-4 rounded-lg shadow-sm">
                            <h4 class="font-medium text-green-800">Total Reports</h4>
                            <p class="text-2xl font-bold text-green-900">{{ $totalReports }}</p>
                        </div>
                        <div class="bg-yellow-100 p-4 rounded-lg shadow-sm">
                            <h4 class="font-medium text-yellow-800">Pending Reports</h4>
                            <p class="text-2xl font-bold text-yellow-900">{{ $pendingReports }}</p>
                        </div>
                        <div class="bg-purple-100 p-4 rounded-lg shadow-sm">
                            <h4 class="font-medium text-purple-800">Total Forum Topics</h4>
                            <p class="text-2xl font-bold text-purple-900">{{ $totalForumTopics }}</p>
                        </div>
                        <div class="bg-red-100 p-4 rounded-lg shadow-sm">
                            <h4 class="font-medium text-red-800">Total News Articles</h4>
                            <p class="text-2xl font-bold text-red-900">{{ $totalNews }}</p>
                        </div>
                    </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
