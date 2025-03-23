import React from 'react'
import { FiEdit } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function ProductCard({ product }) {
  const isHighPrice = product.price > product.expectedPrice;
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity <= 20 && !isOutOfStock;
  const isNotListed = !product.isListed;

  return (
    <motion.div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-24 h-24 rounded-lg object-cover border border-gray-200"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 truncate pr-2">{product.name}</h3>
            <motion.button
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-agri-green transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiEdit className="text-lg" />
            </motion.button>
          </div>
          
          <div className="flex items-baseline mt-1 space-x-2">
            <span className="text-agri-green font-bold">₹{product.price}</span>
            <span className="text-sm text-gray-400 line-through">₹{product.expectedPrice}</span>
          </div>

          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {isHighPrice && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">High Price</span>
              )}
              {!isOutOfStock && !isLowStock && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Best Price</span>
              )}
              {isOutOfStock && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500 text-white">Out of Stock</span>
              )}
              {isLowStock && !isOutOfStock && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">Low Stock</span>
              )}
              {isNotListed && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">Not Listed</span>
              )}
              {!isOutOfStock && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Stock: {product.stock_quantity}</span>
              )}
            </div>
            {product.variants && product.variants.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Variants: {product.variants.map(v => `${v.name}: ${v.options.join(', ')}`).join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
