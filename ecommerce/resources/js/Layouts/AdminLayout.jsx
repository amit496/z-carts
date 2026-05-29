import PanelLayout from '@/Layouts/Admin/PanelLayout';

export default function AdminLayout({ children, title, subtitle, actions }) {
    return (
        <PanelLayout title={title} subtitle={subtitle} actions={actions}>
            {children}
        </PanelLayout>
    );
}
