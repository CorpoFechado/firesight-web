<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('incidents', 'incidents')->name('incidents');
    Route::inertia('risk-mapping', 'risk-mapping')->name('riskMapping');
    Route::inertia('response', 'response')->name('response');
    Route::inertia('alerts', 'alerts')->name('alerts');

    Route::prefix('admin')->middleware('ensure-admin')->group(function () {
        Route::inertia('dashboard', 'admin/dashboard')->name('admin.dashboard');
        Route::inertia('users', 'admin/users')->name('admin.users');
        Route::inertia('data-management', 'admin/data-management')->name('admin.dataManagement');
        Route::inertia('announcements', 'admin/announcements')->name('admin.announcements');
        Route::inertia('alerts', 'admin/alerts')->name('admin.alerts');
    });
});

require __DIR__.'/settings.php';