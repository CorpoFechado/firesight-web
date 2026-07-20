<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AnnouncementType;
use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(Request $request): Response
    {
        $announcements = Announcement::query()
            ->latest('created_at')
            ->get()
            ->map(fn (Announcement $announcement) => [
                'id' => $announcement->announcement_id,
                'title' => $announcement->title,
                'content' => $announcement->content,
                'announcementType' => $announcement->announcement_type->value,
                'status' => $announcement->status->value,
                'date' => ($announcement->status->value === 'published' ? 'Published: ' : 'Last edited: ')
                    .$announcement->created_at->format('F j, Y'),
            ]);

        return Inertia::render('admin/announcements', [
            'announcements' => $announcements,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'content' => ['required', 'string', 'max:500'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'announcement_type' => ['nullable', Rule::enum(AnnouncementType::class)],
        ]);

        Announcement::create([
            'created_by' => $request->user()->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'announcement_type' => $validated['announcement_type'] ?? AnnouncementType::General->value,
            'status' => $validated['status'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Announcement created.']);

        return to_route('admin.announcements');
    }

    public function update(Request $request, Announcement $announcement): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'content' => ['required', 'string', 'max:500'],
            'status' => ['required', Rule::in(['draft', 'published'])],
        ]);

        $announcement->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Announcement updated.']);

        return to_route('admin.announcements');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $title = $announcement->title;
        $announcement->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => "\"{$title}\" deleted."]);

        return to_route('admin.announcements');
    }
}
