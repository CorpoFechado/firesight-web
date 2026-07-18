import { Flame } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-orange-500 text-white">
                <Flame className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-bold">
                    FireSight
                </span>
                <span className="truncate text-xs leading-tight text-sidebar-foreground/70">
                    BFP Personnel Portal
                </span>
            </div>
        </>
    );
}