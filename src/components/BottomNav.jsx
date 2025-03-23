import React from 'react';
import { FiHome, FiList, FiPackage, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function BottomNav({ setActivePage, activePage }) {
  const navigate = useNavigate();
  return (
    <motion.nav
      className="fixed bottom-0 left-0 w-full bg-white shadow-top p-2 flex justify-around items-center z-50"
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
    <span className={`text-xl ${isActive ? 'mb-1' : 'mb-0.5'}`}>{icon}</span>
    <span className={`text-xs font-medium ${isActive ? 'opacity-100' : 'opacity-80'}`}>{text}</span>
    {isActive && <motion.div className="h-1 w-10 bg-white rounded-full mt-1" layoutId="activeTab" />}
  </motion.button>
);
