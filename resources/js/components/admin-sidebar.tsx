import { Link, router } from '@inertiajs/react';
import {
    Bell,
    Database,
    Flame,
    LayoutGrid,
    LogOut,
    Megaphone,
    User,
    Users,
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Data Management', href: '/admin/data-management', icon: Database },
    { title: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { title: 'Alerts', href: '/admin/alerts', icon: Bell },
];

export function AdminSidebar() {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col self-start overflow-y-auto bg-[#0B1A3A] text-slate-200">
            <div className="flex items-center gap-2 px-5 pt-6 pb-6">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-orange-500 text-white">
                    <Flame className="size-5" />
                </div>
                <div className="leading-tight">
                    <div className="text-base font-bold text-white">
                        FireSight
                    </div>
                    <div className="text-xs text-slate-400">Admin</div>
                </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-3">
                {mainNavItems.map((item) => {
                    const active = isCurrentUrl(item.href);

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-md border-l-4 border-transparent px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white',
                                active &&
                                    'border-orange-500 bg-blue-900/60 text-white',
                            )}
                        >
                            {item.icon && <item.icon className="size-4.5" />}
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-white/10 px-3 py-3">
                <Link
                    href={editProfile()}
                    className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white',
                        isCurrentOrParentUrl(editProfile()) &&
                            'bg-blue-900/60 text-white',
                    )}
                >
                    <User className="size-4.5" />
                    Profile
                </Link>
                <button
                    type="button"
                    onClick={() =>
                        router.post(
                            toUrl(logout()),
                            {},
                            { preserveScroll: true },
                        )
                    }
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                    <LogOut className="size-4.5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}