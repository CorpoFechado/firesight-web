import { Head } from '@inertiajs/react';
import { Download, FileText } from 'lucide-react';
import DataManagementController from '@/actions/App/Http/Controllers/Admin/DataManagementController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDataManagement() {
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
                            Download every logged incident record
                        </p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button variant="outline" className="justify-start" asChild>
                            <a href={DataManagementController.exportCsv.url()}>
                                <Download className="size-4" />
                                Export as CSV
                            </a>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                            <a
                                href={DataManagementController.exportPrintable.url()}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Download className="size-4" />
                                Export as PDF
                            </a>
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            PDF opens a print-ready page in a new tab &mdash; use your
                            browser&apos;s &quot;Save as PDF&quot; option.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
