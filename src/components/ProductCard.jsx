import React from 'react'
import { FiEdit } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function ProductCard({ product }) {
  const isHighPrice = product.price > product.expectedPrice;
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity <= 20 && !isOutOfStock;
  const isNotListed = !product.isListed;

  return (
    <motion.div className="p-2 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
        />
        <div className="flex-1 min-w-0 flex items-center space-x-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 truncate pr-2">{product.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-agri-green font-bold whitespace-nowrap">₹{product.price}</span>
                <span className="text-sm text-gray-400 line-through whitespace-nowrap">₹{product.expectedPrice}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {isHighPrice && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High Price</span>
              )}
              {!isOutOfStock && !isLowStock && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Best Price</span>
              )}
              {isOutOfStock && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">Out of Stock</span>
              )}
              {isLowStock && !isOutOfStock && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500 text-white">Low Stock</span>
              )}
              {isNotListed && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-white">Not Listed</span>
              )}
              {!isOutOfStock && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Stock: {product.stock_quantity}</span>
              )}
            </div>
          </div>
          <motion.button
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-agri-green transition-colors flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiEdit className="text-lg" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
