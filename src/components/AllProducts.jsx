import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FiSearch, FiX, FiPlus } from 'react-icons/fi';
import { motion, useAnimation } from 'framer-motion';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useNavigate } from 'react-router-dom';

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [neverAskAgain, setNeverAskAgain] = useLocalStorage('neverAskAgain', false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('all_products')
        .select('*');

      if (error) {
        setError(error.message);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (product, info) => {
    if (info.offset.x > 100) {
      if (neverAskAgain) {
        await handleListProduct(product);
      } else {
        setSelectedProduct(product);
        setShowConfirmModal(true);
      }
    }
  };

  const handleConfirm = async () => {
    if (selectedProduct) {
      await handleListProduct(selectedProduct);
      setShowConfirmModal(false);
      setSelectedProduct(null);
    }
  };

  const handleListProduct = async (product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: product.name,
            description: product.description,
            category: product.category,
            base_price: product.base_price,
            image_url: product.image_url,
            seller_id: (await supabase.auth.getUser()).data.user.id,
            stock_quantity: 0,
            is_listed: true
          }
        ]);

      if (error) throw error;
      navigate('/my-products');
    } catch (err) {
      console.error('Error listing product:', err);
    }
  };

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    return product.name.toLowerCase().includes(query) || 
           product.category.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (loading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Available Products</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            {searchQuery && (
              <FiX
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
          <select
            value={productsPerPage}
            onChange={(e) => setProductsPerPage(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((product) => (
              <motion.tr 
                key={product.id} 
                className="hover:bg-gray-50"
                drag="x"
                dragConstraints={{ left: 0, right: 100 }}
                onDragEnd={(_, info) => handleDragEnd(product, info)}
                whileDrag={{ cursor: 'grabbing' }}
              >
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{product.base_price}</td>
                <td className="px-6 py-4">
                  <div className="truncate max-w-xs">{product.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleListProduct(product)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-agri-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-green"
                  >
                    <FiPlus className="mr-2" />
                    List Product
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">List Product</h3>
            <p className="mb-4">Are you sure you want to list this product at best price?</p>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="neverAskAgain"
                checked={neverAskAgain}
                onChange={(e) => setNeverAskAgain(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="neverAskAgain">Don't ask me again</label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-agri-green text-white rounded-md hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * productsPerPage) + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}