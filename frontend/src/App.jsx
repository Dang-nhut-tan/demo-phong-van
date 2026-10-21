import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import TourListPage from './pages/TourListPage';
import TourDetailPage from './pages/TourDetailPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import LocatorChallengesPage from './pages/LocatorChallengesPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="_appRoot_layout">
            <Header />
            <main className="_appMain_content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:categorySlug" element={<TourListPage />} />
                <Route path="/tours" element={<TourListPage />} />
                <Route path="/tour/:slug" element={<TourDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/lien-he" element={<ContactPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/tuyen-dung" element={<CareersPage />} />
                <Route path="/challenges" element={<LocatorChallengesPage />} />
                <Route path="/practice-locator" element={<LocatorChallengesPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <AuthModal />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
