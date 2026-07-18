import { Head } from '@inertiajs/react';
import { Ban, Search, SquarePen, UserRoundCheck, UserRoundPlus } from 'lucide-react';
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

type Role = 'Resident' | 'BFP Personnel' | 'Admin';
type Status = 'Active' | 'Suspended';

type SystemUser = {
    id: number;
    name: string;
    email: string;
    role: Role;
    phone: string;
    status: Status;
};

const INITIAL_USERS: SystemUser[] = [
    {
        id: 1,
        name: 'Juan dela Cruz',
        email: 'juan.delacruz@email.com',
        role: 'Resident',
        phone: '0917-111-2222',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Lt. Miguel Rodriguez',
        email: 'm.rodriguez@bfp.gov.ph',
        role: 'BFP Personnel',
        phone: '0918-222-3333',
        status: 'Active',
    },
    {
        id: 3,
        name: 'Admin User',
        email: 'admin@lian.gov.ph',
        role: 'Admin',
        phone: '0919-333-4444',
        status: 'Active',
    },
];

const ROLE_STYLES: Record<Role, string> = {
    Resident: 'bg-muted text-muted-foreground',
    'BFP Personnel':
        'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    Admin: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
};

const STATUS_STYLES: Record<Status, string> = {
    Active:
        'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    Suspended: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

export default function AdminUsers() {
    const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');
    const [addOpen, setAddOpen] = useState(false);

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
            active: users.filter((u) => u.status === 'Active').length,
            bfp: users.filter((u) => u.role === 'BFP Personnel').length,
        }),
        [users],
    );

    const toggleSuspend = (user: SystemUser) => {
        const nextStatus: Status =
            user.status === 'Active' ? 'Suspended' : 'Active';

        setUsers((prev) =>
            prev.map((u) =>
                u.id === user.id ? { ...u, status: nextStatus } : u,
            ),
        );

        toast.success(
            nextStatus === 'Suspended'
                ? `${user.name}'s account has been suspended`
                : `${user.name}'s account has been reactivated`,
        );
    };

    const handleAddAccount = () => {
        setAddOpen(false);
        toast.success('BFP personnel account created (demo only)');
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
                            <SelectItem value="Resident">Resident</SelectItem>
                            <SelectItem value="BFP Personnel">
                                BFP Personnel
                            </SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
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
                </div>

                <div className="overflow-hidden rounded-xl border bg-card">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50 text-left text-muted-foreground">
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
                        <tbody>
                            {filtered.map((user) => (
                                <tr key={user.id} className="border-b last:border-0">
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
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {user.phone}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            className={
                                                STATUS_STYLES[user.status]
                                            }
                                            variant="outline"
                                        >
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                onClick={() =>
                                                    toast.info(
                                                        `Editing ${user.name} (demo only)`,
                                                    )
                                                }
                                                aria-label={`Edit ${user.name}`}
                                            >
                                                <SquarePen className="size-4" />
                                            </Button>
                                            {user.status === 'Active' ? (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() =>
                                                        toggleSuspend(user)
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
                                                        toggleSuspend(user)
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

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
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
                            <Input placeholder="Juan Dela Cruz" />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                placeholder="juan.delacruz@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Phone Number{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input placeholder="+63 912 345 6789" />
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Rank <span className="text-red-500">*</span>
                            </Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rank" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fo1">
                                        Fire Officer 1
                                    </SelectItem>
                                    <SelectItem value="fo2">
                                        Fire Officer 2
                                    </SelectItem>
                                    <SelectItem value="fo3">
                                        Fire Officer 3
                                    </SelectItem>
                                    <SelectItem value="senior-fo">
                                        Senior Fire Officer
                                    </SelectItem>
                                    <SelectItem value="inspector">
                                        Fire Inspector
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>
                                Password{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input type="password" placeholder="••••••••" />
                            <p className="text-xs text-muted-foreground">
                                Password must be at least 8 characters
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setAddOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddAccount}>
                            Add Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}