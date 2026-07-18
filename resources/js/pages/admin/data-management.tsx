import { Head } from '@inertiajs/react';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RECENT_EXPORTS = [
    {
        id: 1,
        title: 'Incident Reports - March 2026',
        exportedOn: 'Exported on March 26, 2026',
    },
    {
        id: 2,
        title: 'Incident Reports - February 2026',
        exportedOn: 'Exported on March 1, 2026',
    },
];

export default function AdminDataManagement() {
    const handleExport = (format: 'CSV' | 'PDF') => {
        toast.success(`Exporting incident reports as ${format} (demo only)`);
    };

    return (
        <>
            <Head title="Data Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold">Data Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Export reports and manage data
                    </p>
                </div>

                <Card className="max-w-md">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileText className="size-4.5 text-orange-500" />
                            <CardTitle>Export Incident Reports</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Download all incident reports with filters applied
                        </p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleExport('CSV')}
                        >
                            <Download className="size-4" />
                            Export as CSV
                        </Button>
                        <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleExport('PDF')}
                        >
                            <Download className="size-4" />
                            Export as PDF
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Exports</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {RECENT_EXPORTS.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
                            >
                                <div>
                                    <div className="text-sm font-medium">
                                        {item.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {item.exportedOn}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    onClick={() =>
                                        toast.info(
                                            `Downloading ${item.title} (demo only)`,
                                        )
                                    }
                                    aria-label={`Download ${item.title}`}
                                >
                                    <Download className="size-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}