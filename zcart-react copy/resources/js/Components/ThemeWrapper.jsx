import React from 'react';
import { Head } from '@inertiajs/react';

export default function ThemeWrapper({ children, title, assets = {} }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                {assets.css && <link rel="stylesheet" href={assets.css} />}
                <link rel="stylesheet" href="/themes/default/assets/css/style.css" />
                <link rel="stylesheet" href="/themes/default/assets/css/vendors.css" />
            </Head>
            
            <div className="theme-wrapper">
                {children}
            </div>
            
            {assets.js && <script src={assets.js}></script>}
            <script src="/themes/default/assets/js/app.js"></script>
        </>
    );
}