import { Head, router, useForm } from '@inertiajs/react';
import { Megaphone, Plus, SquarePen, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import AnnouncementController from '@/actions/App/Http/Controllers/Admin/AnnouncementController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type AnnouncementStatus = 'published' | 'draft';

type Announcement = {
    id: number;
    title: string;
    content: string;
    announcementType: string;
    status: AnnouncementStatus;
    date: string;
};

type PageProps = {
    announcements: Announcement[];
};

const STATUS_STYLES: Record<AnnouncementStatus, string> = {
    published:
        'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    draft: 'bg-muted text-muted-foreground',
};

const MAX_CONTENT_LENGTH = 500;

type FormState = {
    title: string;
    content: string;
    status: AnnouncementStatus | '';
};

const emptyForm: FormState = { title: '', content: '', status: '' };

export default function AdminAnnouncements({ announcements }: PageProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editing, setEditing] = useState<Announcement | null>(null);

    const createForm = useForm<FormState>(emptyForm);
    const editForm = useForm<FormState>(emptyForm);

    const stats = useMemo(
        () => ({
            published: announcements.filter((a) => a.status === 'published')
                .length,
            drafts: announcements.filter((a) => a.status === 'draft').length,
        }),
        [announcements],
    );

    const openEdit = (announcement: Announcement) => {
        setEditing(announcement);
        editForm.setData({
            title: announcement.title,
            content: announcement.content,
            status: announcement.status,
        });
    };

    const handleCreate = () => {
        createForm.post(AnnouncementController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                setCreateOpen(false);
            },
        });
    };

    const handleUpdate = () => {
        if (!editing) return;

        editForm.patch(AnnouncementController.update.url(editing.id), {
            preserveScroll: true,
            onSuccess: () => setEditing(null),
        });
    };

    const handleDelete = (announcement: Announcement) => {
        router.delete(AnnouncementController.destroy.url(announcement.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Announcements" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Announcements</h1>
                        <p className="text-sm text-muted-foreground">
                            Create and manage announcements
                        </p>
                    </div>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => setCreateOpen(true)}
                    >
                        <Plus />
                        Create Announcement
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border bg-card p-6 text-center">
                        <div className="text-3xl font-bold">
                            {stats.published}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Published
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-6 text-center">
                        <div className="text-3xl font-bold">
                            {stats.drafts}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Drafts
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className="rounded-xl border bg-card p-5"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <Megaphone className="size-4 text-red-500" />
                                <Badge
                                    className={
                                        STATUS_STYLES[announcement.status]
                                    }
                                    variant="outline"
                                >
                                    {announcement.status}
                                </Badge>
                            </div>
                            <h3 className="font-semibold">
                                {announcement.title}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {announcement.content}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {announcement.date}
                            </p>
                            <div className="mt-3 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEdit(announcement)}
                                >
                                    <SquarePen className="size-3.5" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() =>
                                        handleDelete(announcement)
                                    }
                                >
                                    <Trash2 className="size-3.5" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No announcements yet. Create one to get started.
                        </p>
                    )}
                </div>
            </div>

            {/* Create dialog */}
            <Dialog
                open={createOpen}
                onOpenChange={(open) => {
                    setCreateOpen(open);
                    if (!open) createForm.reset();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                                <Megaphone className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle>Create Announcement</DialogTitle>
                                <DialogDescription>
                                    Post a new announcement to all users
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="Fire Safety Week 2026"
                                value={createForm.data.title}
                                onChange={(e) =>
                                    createForm.setData(
                                        'title',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={createForm.errors.title} />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Content{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                                className="min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                placeholder="Enter announcement details..."
                                maxLength={MAX_CONTENT_LENGTH}
                                value={createForm.data.content}
                                onChange={(e) =>
                                    createForm.setData(
                                        'content',
                                        e.target.value,
                                    )
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                {createForm.data.content.length}/
                                {MAX_CONTENT_LENGTH} characters
                            </p>
                            <InputError message={createForm.errors.content} />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Status <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={createForm.data.status}
                                onValueChange={(value) =>
                                    createForm.setData(
                                        'status',
                                        value as AnnouncementStatus,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="published">
                                        Published
                                    </SelectItem>
                                    <SelectItem value="draft">
                                        Draft
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.status} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setCreateOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={createForm.processing}
                        >
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit dialog */}
            <Dialog
                open={editing !== null}
                onOpenChange={(open) => {
                    if (!open) setEditing(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                                <SquarePen className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle>Edit Announcement</DialogTitle>
                                <DialogDescription>
                                    Update this announcement
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={editForm.data.title}
                                onChange={(e) =>
                                    editForm.setData('title', e.target.value)
                                }
                            />
                            <InputError message={editForm.errors.title} />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Content{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                                className="min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                maxLength={MAX_CONTENT_LENGTH}
                                value={editForm.data.content}
                                onChange={(e) =>
                                    editForm.setData(
                                        'content',
                                        e.target.value,
                                    )
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                {editForm.data.content.length}/
                                {MAX_CONTENT_LENGTH} characters
                            </p>
                            <InputError message={editForm.errors.content} />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Status <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={editForm.data.status}
                                onValueChange={(value) =>
                                    editForm.setData(
                                        'status',
                                        value as AnnouncementStatus,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="published">
                                        Published
                                    </SelectItem>
                                    <SelectItem value="draft">
                                        Draft
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={editForm.errors.status} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setEditing(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={editForm.processing}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
