import { AppSidebar } from '@/components/app-sidebar';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-slate-50">
            <AppSidebar />
            <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
        </div>
    );
}