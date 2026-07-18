import { usePage } from '@inertiajs/react';
import AdminLayoutTemplate from '@/layouts/app/admin-sidebar-layout';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { Auth } from '@/types/auth';

export default function SettingsAppLayout({
    children,
}: {
    breadcrumbs?: never[];
    children: React.ReactNode;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const Template =
        auth.user.role === 'admin' ? AdminLayoutTemplate : AppLayoutTemplate;

    return <Template>{children}</Template>;
}