import { AdminSidebar } from '@/components/admin-sidebar';
import type { AppLayoutProps } from '@/types';

export default function AdminSidebarLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-slate-50">
            <AdminSidebar />
            <main className="min-w-0 flex-1 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}