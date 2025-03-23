import React, { useState } from 'react'
import { FiBell, FiUser } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginForm from './components/auth/LoginForm'
import SignUpForm from './components/auth/SignUpForm'
import GlobalSearchPanel from './components/GlobalSearchPanel'
import ProductCard from './components/ProductCard'
import SellerTips from './components/SellerTips'
import DashboardMetrics from './components/DashboardMetrics'
import AddNewProductButton from './components/AddNewProductButton'
import TodoList from './components/TodoList'
import RecentOrders from './components/RecentOrders'
import BottomNav from './components/BottomNav'
import { products } from './data/products' // Removed dummy products import
import DailySalesGraph from './components/DailySalesGraph'
import MyOrders from './components/MyOrders'
import MyProducts from './components/MyProducts'
import ProfilePage from './components/ProfilePage'
import AllProducts from './components/AllProducts'
import AccountDetailsPage from './components/profile-pages/AccountDetailsPage'
import AddressDetailsPage from './components/profile-pages/AddressDetailsPage'
import MyBillsPage from './components/profile-pages/MyBillsPage'
import OrderSummaryStatsPage from './components/profile-pages/OrderSummaryStatsPage'
import SellerSupportPage from './components/profile-pages/SellerSupportPage'
import PrivacyPolicyPage from './components/profile-pages/PrivacyPolicyPage'
import TermsConditionPage from './components/profile-pages/TermsConditionPage'
import PreferencesPage from './components/profile-pages/PreferencesPage'
import ReferAppPage from './components/profile-pages/ReferAppPage'
import MyStatementsPage from './components/profile-pages/MyStatementsPage'
import SellerScorePage from './components/profile-pages/SellerScorePage'
import TopSellingProducts from './components/TopSellingProducts' // Import TopSellingProducts
import SellerLeaderboardPage from './components/profile-pages/SellerLeaderboardPage'
import DemandForecastPage from './components/profile-pages/DemandForecastPage'
import PriceIntelligencePage from './components/profile-pages/PriceIntelligencePage'


export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activePage, setActivePage] = useState('home')
  const [showLogin, setShowLogin] = useState(true)
  const { user, signOut } = useAuth()

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase())
  }

  // Removed filteredProducts and its logic

  if (!user) {
    return showLogin ? (
      <LoginForm onToggleForm={() => setShowLogin(false)} />
    ) : (
      <SignUpForm onToggleForm={() => setShowLogin(true)} />
    )
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error logging out:', error.message)
    }
  }

  return (
    <Router>
    <div className="min-h-screen bg-agri-gray">
      <motion.nav
        className="bg-gradient-to-r from-agri-green to-agri-green-dark p-3 shadow-md"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-white text-xl font-bold tracking-tight">AgriSeller Pro</h1>
          <div className="flex items-center space-x-3">
            <motion.button
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiBell className="text-base" />
            </motion.button>
            <motion.button
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActivePage('profile')}
            >
              <FiUser className="text-base" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <Routes>
        <Route path="/" element={<>
          <GlobalSearchPanel onSearch={handleSearch} setActivePage={setActivePage} />
          <main className="p-2 space-y-3 pb-14 relative">
            <SellerTips />
            <DashboardMetrics />
            <DailySalesGraph />
            <AddNewProductButton />
            <TodoList />
            <RecentOrders />
            <TopSellingProducts />
          </main>
        </>} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/products" element={<MyProducts />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/profile" element={<ProfilePage setActivePage={setActivePage} onLogout={handleLogout} />} />
        <Route path="/account-details" element={<AccountDetailsPage />} />
        <Route path="/address-details" element={<AddressDetailsPage />} />
        <Route path="/my-bills" element={<MyBillsPage />} />
        <Route path="/order-summary-stats" element={<OrderSummaryStatsPage />} />
        <Route path="/seller-support" element={<SellerSupportPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-condition" element={<TermsConditionPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/refer-app" element={<ReferAppPage />} />
        <Route path="/my-statements" element={<MyStatementsPage />} />
        <Route path="/seller-score" element={<SellerScorePage />} />
        <Route path="/seller-leaderboard" element={<SellerLeaderboardPage />} />
        <Route path="/demand-forecast" element={<DemandForecastPage />} />
        <Route path="/price-intelligence" element={<PriceIntelligencePage />} />
      </Routes>
      <BottomNav setActivePage={setActivePage} activePage={activePage} />
    </div>
    </Router>
  )
}
