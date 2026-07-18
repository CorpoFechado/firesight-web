import { Link } from '@inertiajs/react';
import { Flame } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#22314f] p-6 md:p-10">
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%2394a3b8' stroke-opacity='0.25' stroke-width='1'%3E%3Cpath d='M0 60H120M60 0V120M0 0L120 120M120 0L0 120'/%3E%3C/g%3E%3C/svg%3E\"), radial-gradient(circle at 15% 25%, rgba(249,115,22,0.35), transparent 30%), radial-gradient(circle at 85% 20%, rgba(249,115,22,0.25), transparent 30%), radial-gradient(circle at 75% 80%, rgba(249,115,22,0.3), transparent 32%), radial-gradient(circle at 25% 85%, rgba(249,115,22,0.2), transparent 28%)",
                    backgroundSize:
                        '120px 120px, 100% 100%, 100% 100%, 100% 100%, 100% 100%',
                }}
            />

            <div className="relative z-10 w-full max-w-md">
                <div className="rounded-2xl bg-white p-8 shadow-2xl">
                    <Link
                        href={home()}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-md bg-orange-500 text-white">
                                <Flame className="size-5" />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                                FIRESIGHT
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Fire Incident Reporting &amp; Management
                        </p>
                    </Link>

                    {(title || description) && (
                        <div className="mt-6 mb-6 space-y-1 text-center">
                            {title && (
                                <h1 className="text-lg font-semibold text-slate-900">
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mt-6">{children}</div>
                </div>
            </div>
        </div>
    );
}