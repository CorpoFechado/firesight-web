import { Head, router, useForm } from '@inertiajs/react';
import {
    Ban,
    Search,
    SquarePen,
    UserRoundCheck,
    UserRoundPlus,
    Eye,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
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

type Role = 'resident' | 'bfp_personnel' | 'admin';
type Status = 'active' | 'suspended';

type SystemUser = {
    id: number;
    name: string;
    email: string;
    role: Role;
    phone: string | null;
    status: Status;
    createdAt: string | null;
    rank: string | null;
    stationAssigned: string | null;
    employeeNumber: string | null;
    dutyStatus: string | null;
};

type PageProps = {
    users: SystemUser[];
};

const ROLE_LABELS: Record<Role, string> = {
    resident: 'Resident',
    bfp_personnel: 'BFP Personnel',
    admin: 'Admin',
};

const ROLE_STYLES: Record<Role, string> = {
    resident: 'bg-muted text-muted-foreground',
    bfp_personnel:
        'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    admin: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
};

const STATUS_STYLES: Record<Status, string> = {
    active:
        'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    suspended: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

const RANK_OPTIONS: { key: string; label: string }[] = [
    { key: 'fo1', label: 'Fire Officer 1' },
    { key: 'fo2', label: 'Fire Officer 2' },
    { key: 'fo3', label: 'Fire Officer 3' },
    { key: 'senior-fo', label: 'Senior Fire Officer' },
    { key: 'inspector', label: 'Fire Inspector' },
];

const RANK_LABEL_TO_KEY = Object.fromEntries(
    RANK_OPTIONS.map((r) => [r.label, r.key]),
);

const DUTY_STATUS_LABELS: Record<string, string> = {
    on_duty: 'On Duty',
    on_leave: 'On Leave',
    deployed: 'Deployed',
};

type AddAccountForm = {
    name: string;
    email: string;
    phone: string;
    rank: string;
    password: string;
};

const emptyAddForm: AddAccountForm = {
    name: '',
    email: '',
    phone: '',
    rank: '',
    password: '',
};

type EditAccountForm = {
    name: string;
    email: string;
    phone: string;
    rank: string;
};

export default function AdminUsers({ users }: PageProps) {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');
    const [addOpen, setAddOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState<SystemUser | null>(null);
    const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
    const [confirmingUser, setConfirmingUser] = useState<SystemUser | null>(
        null,
    );

    const addForm = useForm<AddAccountForm>(emptyAddForm);
    const editForm = useForm<EditAccountForm>({
        name: '',
        email: '',
        phone: '',
        rank: '',
    });

    const filtered = useMemo(() => {
        return users.filter((user) => {
            const matchesRole =
                roleFilter === 'All' || user.role === roleFilter;
            const matchesSearch =
                search.trim() === '' ||
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase());

            return matchesRole && matchesSearch;
        });
    }, [users, search, roleFilter]);

    const stats = useMemo(
        () => ({
            total: users.length,
            active: users.filter((u) => u.status === 'active').length,
            bfp: users.filter((u) => u.role === 'bfp_personnel').length,
            admins: users.filter((u) => u.role === 'admin').length,
            residents: users.filter((u) => u.role === 'resident').length,
        }),
        [users],
    );

    const openEdit = (user: SystemUser) => {
        setEditingUser(user);
        editForm.clearErrors();
        editForm.setData({
            name: user.name,
            email: user.email,
            phone: user.phone ?? '',
            rank: user.rank ? (RANK_LABEL_TO_KEY[user.rank] ?? '') : '',
        });
    };

    const handleEditSubmit = () => {
        if (!editingUser) return;

        editForm.patch(UserController.update.url(editingUser.id), {
            preserveScroll: true,
            onSuccess: () => setEditingUser(null),
        });
    };

    const handleAddAccount = () => {
        addForm.post(UserController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                addForm.reset();
                setAddOpen(false);
            },
        });
    };

    const confirmToggle = () => {
        if (!confirmingUser) return;

        router.patch(
            UserController.toggleStatus.url(confirmingUser.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => setConfirmingUser(null),
            },
        );
    };

    return (
        <>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            User Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage system users and roles
                        </p>
                    </div>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => setAddOpen(true)}
                    >
                        <UserRoundPlus />
                        Add User
                    </Button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={roleFilter}
                        onValueChange={(value) =>
                            setRoleFilter(value as Role | 'All')
                        }
                    >
                        <SelectTrigger className="sm:w-48">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Roles</SelectItem>
                            <SelectItem value="resident">Resident</SelectItem>
                            <SelectItem value="bfp_personnel">
                                BFP Personnel
                            </SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    <div className="rounded-xl border bg-card p-6 text-center">
                        <div className="text-3xl font-bold">
                            {stats.total}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Total Users
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-6 text-center">
                        <div className="text-3xl font-bold">
                            {stats.active}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Active
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-6 text-center">
                        <div className="text-3xl font-bold">{stats.bfp}</div>
                        <div className="text-sm text-muted-foreground">
                            BFP Personnel
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-6 text-center">
                        <div className="text-3xl font-bold">
                            {stats.admins}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Admins
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-6 text-center">
                        <div className="text-3xl font-bold">
                            {stats.residents}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Residents
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    Name
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Email
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Role
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Phone
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-4 py-3 font-medium">
                                        {user.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            className={ROLE_STYLES[user.role]}
                                            variant="outline"
                                        >
                                            {ROLE_LABELS[user.role]}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {user.phone ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            className={
                                                STATUS_STYLES[user.status]
                                            }
                                            variant="outline"
                                        >
                                            {user.status === 'active'
                                                ? 'Active'
                                                : 'Suspended'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                onClick={() =>
                                                    setViewingUser(user)
                                                }
                                                aria-label={`View ${user.name}'s details`}
                                            >
                                                <Eye className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                onClick={() => openEdit(user)}
                                                aria-label={`Edit ${user.name}`}
                                            >
                                                <SquarePen className="size-4" />
                                            </Button>
                                            {user.status === 'active' ? (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() =>
                                                        setConfirmingUser(
                                                            user,
                                                        )
                                                    }
                                                    aria-label={`Suspend ${user.name}'s account`}
                                                >
                                                    <Ban className="size-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                    onClick={() =>
                                                        setConfirmingUser(
                                                            user,
                                                        )
                                                    }
                                                    aria-label={`Reactivate ${user.name}'s account`}
                                                >
                                                    <UserRoundCheck className="size-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No users match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View details dialog */}
            <Dialog
                open={viewingUser !== null}
                onOpenChange={(open) => {
                    if (!open) setViewingUser(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                                <Eye className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle>User Details</DialogTitle>
                                <DialogDescription>
                                    Account information
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {viewingUser && (
                        <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">
                                    {viewingUser.name}
                                </span>
                                <div className="flex gap-2">
                                    <Badge
                                        className={
                                            ROLE_STYLES[viewingUser.role]
                                        }
                                        variant="outline"
                                    >
                                        {ROLE_LABELS[viewingUser.role]}
                                    </Badge>
                                    <Badge
                                        className={
                                            STATUS_STYLES[viewingUser.status]
                                        }
                                        variant="outline"
                                    >
                                        {viewingUser.status === 'active'
                                            ? 'Active'
                                            : 'Suspended'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Email
                                    </div>
                                    <div>{viewingUser.email}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Phone
                                    </div>
                                    <div>{viewingUser.phone ?? '—'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Member Since
                                    </div>
                                    <div>{viewingUser.createdAt ?? '—'}</div>
                                </div>
                                {viewingUser.role === 'bfp_personnel' && (
                                    <>
                                        <div>
                                            <div className="text-xs text-muted-foreground">
                                                Duty Status
                                            </div>
                                            <div>
                                                {viewingUser.dutyStatus
                                                    ? DUTY_STATUS_LABELS[
                                                          viewingUser
                                                              .dutyStatus
                                                      ]
                                                    : '—'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">
                                                Rank
                                            </div>
                                            <div>
                                                {viewingUser.rank ?? '—'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">
                                                Station Assigned
                                            </div>
                                            <div>
                                                {viewingUser.stationAssigned ??
                                                    '—'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">
                                                Employee Number
                                            </div>
                                            <div>
                                                {viewingUser.employeeNumber ??
                                                    '—'}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setViewingUser(null)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit details dialog */}
            <Dialog
                open={editingUser !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingUser(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                                <SquarePen className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle>Edit User Details</DialogTitle>
                                <DialogDescription>
                                    Update account information
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>
                                Full Name{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                            />
                            <InputError message={editForm.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) =>
                                    editForm.setData('email', e.target.value)
                                }
                            />
                            <InputError message={editForm.errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Phone Number</Label>
                            <Input
                                value={editForm.data.phone}
                                onChange={(e) =>
                                    editForm.setData('phone', e.target.value)
                                }
                            />
                            <InputError message={editForm.errors.phone} />
                        </div>
                        {editingUser?.role === 'bfp_personnel' && (
                            <div className="grid gap-2">
                                <Label>Rank</Label>
                                <Select
                                    value={editForm.data.rank}
                                    onValueChange={(value) =>
                                        editForm.setData('rank', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select rank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {RANK_OPTIONS.map((option) => (
                                            <SelectItem
                                                key={option.key}
                                                value={option.key}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={editForm.errors.rank} />
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setEditingUser(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditSubmit}
                            disabled={editForm.processing}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Suspend / reactivate confirmation dialog */}
            <Dialog
                open={confirmingUser !== null}
                onOpenChange={(open) => {
                    if (!open) setConfirmingUser(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex size-9 items-center justify-center rounded-md ${
                                    confirmingUser?.status === 'active'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-green-100 text-green-700'
                                }`}
                            >
                                {confirmingUser?.status === 'active' ? (
                                    <Ban className="size-4.5" />
                                ) : (
                                    <UserRoundCheck className="size-4.5" />
                                )}
                            </div>
                            <div>
                                <DialogTitle>
                                    {confirmingUser?.status === 'active'
                                        ? 'Suspend Account'
                                        : 'Reactivate Account'}
                                </DialogTitle>
                                <DialogDescription>
                                    This will take effect immediately
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        {confirmingUser?.status === 'active' ? (
                            <>
                                Are you sure you want to suspend{' '}
                                <span className="font-medium text-foreground">
                                    {confirmingUser?.name}
                                </span>
                                &apos;s account? They will lose access until
                                reactivated.
                            </>
                        ) : (
                            <>
                                Are you sure you want to reactivate{' '}
                                <span className="font-medium text-foreground">
                                    {confirmingUser?.name}
                                </span>
                                &apos;s account?
                            </>
                        )}
                    </p>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setConfirmingUser(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={
                                confirmingUser?.status === 'active'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-green-600 hover:bg-green-700'
                            }
                            onClick={confirmToggle}
                        >
                            {confirmingUser?.status === 'active'
                                ? 'Suspend'
                                : 'Reactivate'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add account dialog */}
            <Dialog
                open={addOpen}
                onOpenChange={(open) => {
                    setAddOpen(open);
                    if (!open) addForm.reset();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                                <UserRoundPlus className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle>
                                    Add BFP Personnel Account
                                </DialogTitle>
                                <DialogDescription>
                                    Create a new BFP personnel account
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>
                                Full Name{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="Juan Dela Cruz"
                                value={addForm.data.name}
                                onChange={(e) =>
                                    addForm.setData('name', e.target.value)
                                }
                            />
                            <InputError message={addForm.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                placeholder="juan.delacruz@example.com"
                                value={addForm.data.email}
                                onChange={(e) =>
                                    addForm.setData('email', e.target.value)
                                }
                            />
                            <InputError message={addForm.errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Phone Number{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="+63 912 345 6789"
                                value={addForm.data.phone}
                                onChange={(e) =>
                                    addForm.setData('phone', e.target.value)
                                }
                            />
                            <InputError message={addForm.errors.phone} />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Rank <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={addForm.data.rank}
                                onValueChange={(value) =>
                                    addForm.setData('rank', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rank" />
                                </SelectTrigger>
                                <SelectContent>
                                    {RANK_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.key}
                                            value={option.key}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={addForm.errors.rank} />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Password{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={addForm.data.password}
                                onChange={(e) =>
                                    addForm.setData(
                                        'password',
                                        e.target.value,
                                    )
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Password must be at least 8 characters
                            </p>
                            <InputError message={addForm.errors.password} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setAddOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddAccount}
                            disabled={addForm.processing}
                        >
                            Add Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
