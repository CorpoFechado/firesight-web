<?php

use App\Http\Controllers\Admin\AlertController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DataManagementController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('incidents', 'incidents')->name('incidents');
    Route::inertia('risk-mapping', 'risk-mapping')->name('riskMapping');
    Route::inertia('response', 'response')->name('response');
    Route::inertia('alerts', 'alerts')->name('alerts');

    Route::prefix('admin')->middleware('ensure-admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

        Route::get('users', [UserController::class, 'index'])->name('admin.users');
        Route::post('users', [UserController::class, 'store'])->name('admin.users.store');
        Route::patch('users/{user}', [UserController::class, 'update'])->name('admin.users.update');
        Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('admin.users.toggleStatus');

        Route::get('announcements', [AnnouncementController::class, 'index'])->name('admin.announcements');
        Route::post('announcements', [AnnouncementController::class, 'store'])->name('admin.announcements.store');
        Route::patch('announcements/{announcement}', [AnnouncementController::class, 'update'])->name('admin.announcements.update');
        Route::delete('announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('admin.announcements.destroy');

        Route::get('alerts', [AlertController::class, 'index'])->name('admin.alerts');
        Route::patch('alerts/units/{unit}/assign', [AlertController::class, 'assignUnit'])->name('admin.alerts.assignUnit');

        Route::get('data-management', [DataManagementController::class, 'index'])->name('admin.dataManagement');
        Route::get('data-management/export/csv', [DataManagementController::class, 'exportCsv'])->name('admin.dataManagement.exportCsv');
        Route::get('data-management/export/print', [DataManagementController::class, 'exportPrintable'])->name('admin.dataManagement.exportPrintable');
    });
});

require __DIR__.'/settings.php';