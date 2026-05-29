import React from 'react';
import ThemeWrapper from '@/Components/ThemeWrapper';

export default function Home({ sliders = [], banners = {}, categories = [], products = [] }) {
    return (
        <ThemeWrapper title="zCart - Marketplace">
            {/* Main Navigation */}
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <a className="navbar-brand" href="/">
                        <img src="/images/logo.png" alt="zCart" height="40" />
                    </a>
                    
                    <div className="navbar-nav ms-auto">
                        <a className="nav-link" href="/login">Login</a>
                        <a className="nav-link" href="/register">Register</a>
                        <a className="nav-link" href="/cart">Cart</a>
                    </div>
                </div>
            </nav>

            {/* Main Slider */}
            {sliders.length > 0 && (
                <section className="slider-section">
                    <div className="container">
                        <div id="main-slider" className="carousel slide">
                            <div className="carousel-inner">
                                {sliders.map((slider, index) => (
                                    <div key={slider.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <img src={slider.image} className="d-block w-100" alt={slider.title} />
                                        <div className="carousel-caption">
                                            <h3>{slider.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Categories */}
            {categories.length > 0 && (
                <section className="featured-categories py-5">
                    <div className="container">
                        <h2 className="text-center mb-4">Featured Categories</h2>
                        <div className="row">
                            {categories.map(category => (
                                <div key={category.id} className="col-md-3 mb-3">
                                    <div className="category-card text-center">
                                        <img src={category.image || '/images/placeholder.png'} 
                                             alt={category.name} className="img-fluid mb-2" />
                                        <h5>{category.name}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {products.length > 0 && (
                <section className="featured-products py-5 bg-light">
                    <div className="container">
                        <h2 className="text-center mb-4">Featured Products</h2>
                        <div className="row">
                            {products.map(product => (
                                <div key={product.id} className="col-md-4 mb-4">
                                    <div className="product-card card">
                                        <img src={product.image || '/images/placeholder.png'} 
                                             className="card-img-top" alt={product.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="card-text">${product.price}</p>
                                            <button className="btn btn-primary">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-dark text-white py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h5>zCart Marketplace</h5>
                            <p>Your trusted online marketplace</p>
                        </div>
                        <div className="col-md-6 text-end">
                            <p>&copy; 2024 zCart. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </ThemeWrapper>
    );
}