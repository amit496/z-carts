<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminUtilityController extends Controller
{
    public function pdfTemplates()
    {
        return Inertia::render('Admin/Utilities/PdfTemplates');
    }

    public function smartForms()
    {
        return Inertia::render('Admin/Utilities/SmartForms');
    }

    public function events()
    {
        return Inertia::render('Admin/Utilities/Events');
    }

    public function emailTemplates()
    {
        return Inertia::render('Admin/Utilities/EmailTemplates');
    }

    public function pages()
    {
        return Inertia::render('Admin/Utilities/Pages');
    }

    public function blogs()
    {
        return Inertia::render('Admin/Utilities/Blogs');
    }

    public function faqs()
    {
        return Inertia::render('Admin/Utilities/Faqs');
    }
}
