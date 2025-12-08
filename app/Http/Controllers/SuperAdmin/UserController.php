<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/super-admin/users",
     *     summary="Get list of all users",
     *     tags={"Super Admin"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="links", type="object"),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = User::withoutGlobalScope(\App\Scopes\PartnerScope::class)
            ->with('partner')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        $users = $query->paginate(10);

        return response()->json($users);
    }

    /**
     * @OA\Post(
     *     path="/api/super-admin/users/{id}/suspend",
     *     summary="Suspend a user",
     *     tags={"Super Admin"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User suspended successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function suspend($id)
    {
        $user = User::withoutGlobalScope(\App\Scopes\PartnerScope::class)->findOrFail($id);
        $user->update(['status' => 'suspended']);

        return response()->json(['message' => 'User suspended successfully']);
    }

    /**
     * @OA\Post(
     *     path="/api/super-admin/users/{id}/activate",
     *     summary="Activate a user",
     *     tags={"Super Admin"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User activated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function activate($id)
    {
        $user = User::withoutGlobalScope(\App\Scopes\PartnerScope::class)->findOrFail($id);
        $user->update(['status' => 'active']);

        return response()->json(['message' => 'User activated successfully']);
    }

    /**
     * @OA\Post(
     *     path="/api/super-admin/users/{id}/ban",
     *     summary="Ban a user",
     *     tags={"Super Admin"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User banned successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function ban($id)
    {
        $user = User::withoutGlobalScope(\App\Scopes\PartnerScope::class)->findOrFail($id);
        $user->update(['status' => 'banned']);

        return response()->json(['message' => 'User banned successfully']);
    }

    /**
     * @OA\Post(
     *     path="/api/super-admin/users/{id}/promote",
     *     summary="Promote a user",
     *     tags={"Super Admin"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User promoted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function promote($id)
    {
        $user = User::withoutGlobalScope(\App\Scopes\PartnerScope::class)->findOrFail($id);

        if ($user->role === 'super_admin') {
             return response()->json(['message' => 'User is already a Super Admin'], 422);
        }

        if ($user->role === 'partner_admin') {
            // Promote Partner Admin to Super Admin (Global)
            $user->update(['role' => 'super_admin', 'partner_id' => null]);
            return response()->json(['message' => 'User promoted to Super Admin successfully']);
        }

        if ($user->role === 'general_user') {
            if ($user->partner_id) {
                // Promote Partner User to Partner Admin
                $user->update(['role' => 'partner_admin']);
                return response()->json(['message' => 'User promoted to Partner Admin successfully']);
            } else {
                // Promote Global User to Super Admin
                $user->update(['role' => 'super_admin']);
                return response()->json(['message' => 'User promoted to Super Admin successfully']);
            }
        }

        return response()->json(['message' => 'User promoted successfully']);
    }
}
