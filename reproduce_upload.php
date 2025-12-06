<?php

use Illuminate\Http\Request;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\UploadedFile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);

$user = User::where('role', 'super_admin')->first();
if (!$user) die("No user found");

// Setup auth
Auth::guard('web')->login($user); // Or sanitum? API routes use sanctum.
// For API routes protected by sanctum, we might need to pretend we are authenticated.
// Since we are running kernel handle, middlewares will run.
// Ensure we use 'web' or 'sanctum' properly.
// Let's try actingAs equivalent.
$app['auth']->guard('sanctum')->setUser($user);

$filePath = __DIR__.'/public/assets/icon.png';
if (!file_exists($filePath)) die("File not found at $filePath");

// Copy to tmp so we don't move the original
$tmpPath = sys_get_temp_dir() . '/test_upload.png';
copy($filePath, $tmpPath);

$uploadedFile = new UploadedFile(
    $tmpPath,
    'icon.png',
    'image/png',
    null,
    true 
);

$request = Request::create(
    '/api/profile',
    'POST',
    [
        'name' => $user->name,
        'email' => $user->email,
    ],
    [],
    ['profile_picture' => $uploadedFile],
    [
        'HTTP_ACCEPT' => 'application/json',
        'CONTENT_TYPE' => 'multipart/form-data' // Request::create handles this but good to be explicit
    ]
);

// We need to ensure the request is treated as authenticated.
// The easiest way for a raw kernel request is often disabling middleware or manually mocking.
// But we want to test the full stack.
// Sanctum checks headers. Let's create a token for the user and pass it.
$token = $user->createToken('test')->plainTextToken;
$request->headers->set('Authorization', 'Bearer ' . $token);


echo "Sending request...\n";
$response = $kernel->handle($request);

echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
