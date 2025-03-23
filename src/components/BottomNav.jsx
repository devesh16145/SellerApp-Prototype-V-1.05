import React from 'react';
import { FiHome, FiList, FiPackage, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function BottomNav({ setActivePage, activePage }) {
  const navigate = useNavigate();
  return (
    <motion.nav
      className="fixed bottom-0 left-0 w-full mx-auto right-0 bg-white shadow-top py-1.5 px-1 flex justify-around items-center z-50 rounded-t-xl"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <NavItem
        icon={<FiHome />}
        text="Home"
        onClick={() => {
          setActivePage('home');
          navigate('/');
        }}
        isActive={activePage === 'home'}
      />
      <NavItem
        icon={<FiList />}
        text="Orders"
        onClick={() => {
          setActivePage('orders');
          navigate('/orders');
        }}
        isActive={activePage === 'orders'}
      />
      <NavItem
        icon={<FiPackage />}
        text="Products"
        onClick={() => {
          setActivePage('products');
          navigate('/products');
        }}
        isActive={activePage === 'products'}
      />
      <NavItem
        icon={<FiAward />}
        text="Leaderboard"
        onClick={() => {
          setActivePage('leaderboard');
          navigate('/seller-leaderboard');
        }}
        isActive={activePage === 'leaderboard'}
      />
    </motion.nav>
  );
}

const NavItem = ({ icon, text, onClick, isActive }) => (
  <motion.button
    className={`flex flex-col items-center justify-center p-2 rounded-xl ${isActive 
      ? 'bg-gradient-to-r from-agri-green to-agri-green-dark text-white' 
      : 'text-gray-500 hover:bg-agri-gray'}`}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span className={`text-lg ${isActive ? 'mb-0.5' : 'mb-0'}`}>{icon}</span>
    <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-80'}`}>{text}</span>
    {isActive && <motion.div className="h-0.5 w-12 bg-white rounded-full mt-0.5" layoutId="activeTab" />}
  </motion.button>
);
