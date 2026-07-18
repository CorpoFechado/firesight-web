import { Head } from '@inertiajs/react';
import { Megaphone, Plus, SquarePen, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
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
    status: AnnouncementStatus;
    date: string;
};

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 1,
        title: 'Fire Safety Week 2026',
        content:
            'Join us for Fire Safety Week from March 30 to April 3. Free fire extinguisher training will be held at the municipal hall.',
        status: 'published',
        date: 'Published: March 20, 2026',
    },
    {
        id: 2,
        title: 'New Reporting Feature',
        content:
            "We've added photo upload capability to the incident reporting form for faster, more accurate assessments.",
        status: 'published',
        date: 'Published: March 15, 2026',
    },
    {
        id: 3,
        title: 'Scheduled Maintenance',
        content:
            'System maintenance scheduled for March 28, 2026 from 2:00 AM to 4:00 AM. The portal may be briefly unavailable.',
        status: 'draft',
        date: 'Last edited: March 18, 2026',
    },
];

const STATUS_STYLES: Record<AnnouncementStatus, string> = {
    published:
        'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    draft: 'bg-muted text-muted-foreground',
};

const MAX_CONTENT_LENGTH = 500;

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState(
        INITIAL_ANNOUNCEMENTS,
    );
    const [createOpen, setCreateOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<AnnouncementStatus | ''>('');

    const stats = useMemo(
        () => ({
            published: announcements.filter((a) => a.status === 'published')
                .length,
            drafts: announcements.filter((a) => a.status === 'draft').length,
        }),
        [announcements],
    );

    const resetForm = () => {
        setTitle('');
        setContent('');
        setStatus('');
    };

    const handleCreate = () => {
        if (!title.trim() || !content.trim() || !status) {
            toast.error('Please fill in all fields');
            return;
        }

        setAnnouncements((prev) => [
            {
                id: Date.now(),
                title,
                content,
                status,
                date:
                    status === 'published'
                        ? 'Published: just now'
                        : 'Last edited: just now',
            },
            ...prev,
        ]);
        resetForm();
        setCreateOpen(false);
        toast.success('Announcement created (demo only)');
    };

    const handleDelete = (announcement: Announcement) => {
        setAnnouncements((prev) =>
            prev.filter((a) => a.id !== announcement.id),
        );
        toast.success(`"${announcement.title}" deleted`);
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
                                    onClick={() =>
                                        toast.info(
                                            `Editing "${announcement.title}" (demo only)`,
                                        )
                                    }
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
                </div>
            </div>

            <Dialog
                open={createOpen}
                onOpenChange={(open) => {
                    setCreateOpen(open);
                    if (!open) resetForm();
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
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
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
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                {content.length}/{MAX_CONTENT_LENGTH}{' '}
                                characters
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Status <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={status}
                                onValueChange={(value) =>
                                    setStatus(value as AnnouncementStatus)
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
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setCreateOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}