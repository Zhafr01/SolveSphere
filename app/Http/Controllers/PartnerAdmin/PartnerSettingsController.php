<?php

namespace App\Http\Controllers\PartnerAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Partner;

class PartnerSettingsController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/partner-admin/settings",
     *     summary="Update partner settings",
     *     tags={"Partner Admin"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="description", type="string"),
     *                 @OA\Property(property="website", type="string"),
     *                 @OA\Property(property="logo", type="string", format="binary"),
     *                 @OA\Property(property="banner", type="string", format="binary"),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Settings updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="partner", type="object")
     *         )
     *     )
     * )
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        if (!$user->partner_id) {
            return response()->json(['message' => 'User does not belong to a partner.'], 403);
        }

        $partner = Partner::findOrFail($user->partner_id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'logo' => 'nullable|image|max:2048', // 2MB Max
            'banner' => 'nullable|image|max:4096', // 4MB Max
        ]);

        $partner->name = $request->name;
        $partner->description = $request->description;
        $partner->website = $request->website;

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($partner->logo) {
                // Assuming logo stored as URL, extract path if needed, or if using storage link
                $oldPath = str_replace('/storage/', '', $partner->logo); 
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('logo')->store('logos', 'public');
            $partner->logo = '/storage/' . $path;
        }

        if ($request->hasFile('banner')) {
             // Delete old banner if exists
             if ($partner->banner) {
                $oldPath = str_replace('/storage/', '', $partner->banner);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('banner')->store('banners', 'public');
            $partner->banner = '/storage/' . $path;
        }

        $partner->save();

        return response()->json([
            'message' => 'Settings updated successfully',
            'partner' => $partner
        ]);
    }
    
    /**
     * Get current partner settings
     */
    public function show()
    {
        $user = Auth::user();
        
        if (!$user->partner_id) {
            return response()->json(['message' => 'User does not belong to a partner.'], 403);
        }

        $partner = Partner::findOrFail($user->partner_id);
        
        return response()->json([
            'partner' => $partner
        ]);
    }
}
