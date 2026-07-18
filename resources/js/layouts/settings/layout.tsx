import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    { title: 'Profile', href: edit(), icon: null },
    { title: 'Security', href: editSecurity(), icon: null },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-6 md:p-8">
            <div>
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings
                </p>
            </div>

            <div className="inline-flex w-fit items-center gap-1 rounded-full bg-muted p-1">
                {sidebarNavItems.map((item, index) => {
                    const active = isCurrentOrParentUrl(item.href);

                    return (
                        <Link
                            key={`${toUrl(item.href)}-${index}`}
                            href={item.href}
                            className={cn(
                                'rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors',
                                active && 'bg-white text-foreground shadow-sm',
                            )}
                        >
                            {item.title}
                        </Link>
                    );
                })}
            </div>

            <section className="max-w-3xl">{children}</section>
        </div>
    );
}