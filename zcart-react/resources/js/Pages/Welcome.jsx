import React from 'react';
import { Head } from '@inertiajs/react';

export default function Welcome({ message }) {
    return (
        <>
            <Head title="Welcome to zCart" />
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontFamily: 'Arial, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ color: '#4F46E5', fontSize: '3rem', marginBottom: '1rem' }}>
                        zCart React
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#6B7280' }}>
                        {message}
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <a href="/admin" style={{ 
                            backgroundColor: '#4F46E5', 
                            color: 'white', 
                            padding: '0.75rem 1.5rem', 
                            textDecoration: 'none', 
                            borderRadius: '0.5rem',
                            marginRight: '1rem'
                        }}>
                            Admin Panel
                        </a>
                        <a href="/merchant" style={{ 
                            backgroundColor: '#059669', 
                            color: 'white', 
                            padding: '0.75rem 1.5rem', 
                            textDecoration: 'none', 
                            borderRadius: '0.5rem'
                        }}>
                            Merchant Panel
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}