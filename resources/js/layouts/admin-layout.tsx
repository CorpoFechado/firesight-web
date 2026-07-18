import AdminLayoutTemplate from '@/layouts/app/admin-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AdminLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AdminLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AdminLayoutTemplate>
    );
}