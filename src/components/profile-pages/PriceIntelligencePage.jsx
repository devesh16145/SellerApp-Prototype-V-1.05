import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { FiTrendingUp, FiSearch, FiRefreshCw, FiDownload, FiFilter } from 'react-icons/fi';

export default function PriceIntelligencePage() {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [originalPriceData, setOriginalPriceData] = useState([]);
  
  // Categories for agricultural inputs
  const categories = [
    'All',
    'Seeds',
    'Fertilizers',
    'Pesticides',
    'Farm Equipment',
    'Irrigation Supplies'
  ];

  useEffect(() => {
    fetchPriceData();
  }, [userId, selectedCategory]);

  const fetchPriceData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to a price intelligence service
      // For this prototype, we'll simulate price data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate simulated price data
      const simulatedData = generateSimulatedPriceData(selectedCategory);
      setPriceData(simulatedData);
      setOriginalPriceData(simulatedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch price intelligence data');
      console.error('Error fetching price data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSimulatedPriceData = (category) => {
    // This function simulates competitive price intelligence data
    // In a real app, this would come from market data APIs and web scraping
    
    const products = [];
    
    // Base products by category
    const seedProducts = ['Wheat Seeds', 'Rice Seeds', 'Cotton Seeds', 'Maize Seeds', 'Soybean Seeds'];
    const fertilizerProducts = ['Urea', 'DAP', 'NPK Complex', 'Organic Manure', 'Micronutrients'];
    const pesticideProducts = ['Insecticides', 'Fungicides', 'Herbicides', 'Bio-pesticides', 'Growth Regulators'];
    const equipmentProducts = ['Tractors', 'Harvesters', 'Sprayers', 'Tillers', 'Threshers'];
    const irrigationProducts = ['Drip Systems', 'Sprinklers', 'Water Pumps', 'Pipes', 'Filters'];
    
    // Select products based on category
    let selectedProducts = [];
    if (category === 'All' || category === 'Seeds') selectedProducts = [...selectedProducts, ...seedProducts];
    if (category === 'All' || category === 'Fertilizers') selectedProducts = [...selectedProducts, ...fertilizerProducts];
    if (category === 'All' || category === 'Pesticides') selectedProducts = [...selectedProducts, ...pesticideProducts];
    if (category === 'All' || category === 'Farm Equipment') selectedProducts = [...selectedProducts, ...equipmentProducts];
    if (category === 'All' || category === 'Irrigation Supplies') selectedProducts = [...selectedProducts, ...irrigationProducts];
    
    // Limit to 15 products if 'All' is selected to avoid overwhelming the UI
    if (category === 'All') {
      selectedProducts = selectedProducts.slice(0, 15);
    }
    
    // Generate price data for each product
    selectedProducts.forEach(product => {
      // Your price (base price)
      const yourPrice = getBasePrice(product);
      
      // Generate competitor prices (3-5 competitors)
      const numCompetitors = Math.floor(Math.random() * 3) + 3; // 3-5 competitors
      const competitors = [];
      
      for (let i = 0; i < numCompetitors; i++) {
        // Competitor price variation (-15% to +15% from your price)
        const priceVariation = (Math.random() * 0.3) - 0.15;
        const competitorPrice = Math.round(yourPrice * (1 + priceVariation));
        
        competitors.push({
          name: getCompetitorName(i),
          price: competitorPrice,
          difference: Math.round(((competitorPrice - yourPrice) / yourPrice) * 100)
        });
      }
      
      // Calculate market statistics
      const allPrices = [yourPrice, ...competitors.map(c => c.price)];
      const minPrice = Math.min(...allPrices);
      const maxPrice = Math.max(...allPrices);
      const avgPrice = Math.round(allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length);
      
      // Determine price position
      const pricePosition = allPrices.sort((a, b) => a - b).indexOf(yourPrice) + 1;
      const positionText = pricePosition === 1 ? 'Lowest Price' : 
                          pricePosition === allPrices.length ? 'Highest Price' : 
                          `${pricePosition} of ${allPrices.length}`;
      
      // Determine if your price is competitive
      const isPriceCompetitive = yourPrice <= avgPrice;
      
      // Generate recommendation
      const recommendation = generatePriceRecommendation(yourPrice, minPrice, avgPrice, maxPrice, isPriceCompetitive);
      
      products.push({
        id: Math.random().toString(36).substr(2, 9),
        name: product,
        category: getCategoryForProduct(product),
        yourPrice,
        competitors,
        marketStats: {
          minPrice,
          maxPrice,
          avgPrice,
          pricePosition: positionText,
          isPriceCompetitive
        },
        recommendation
      });
    });
    
    // Sort by competitiveness (non-competitive first to highlight issues)
    return products.sort((a, b) => a.marketStats.isPriceCompetitive - b.marketStats.isPriceCompetitive);
  };
  
  // Helper functions for generating realistic data
  const getBasePrice = (product) => {
    // Simulated base prices for different product types
    if (product.includes('Seeds')) {
      return Math.floor(Math.random() * 500) + 200; // ₹200-700 per unit
    } else if (product.includes('Fertilizer') || product.includes('Urea') || product.includes('DAP') || product.includes('NPK')) {
      return Math.floor(Math.random() * 300) + 100; // ₹100-400 per unit
    } else if (product.includes('cide') || product.includes('pesticide') || product.includes('Growth')) {
      return Math.floor(Math.random() * 400) + 150; // ₹150-550 per unit
    } else if (product.includes('Tractor') || product.includes('Harvester')) {
      return Math.floor(Math.random() * 50000) + 10000; // ₹10,000-60,000 per unit
    } else if (product.includes('Irrigation') || product.includes('Drip') || product.includes('Sprinkler')) {
      return Math.floor(Math.random() * 2000) + 500; // ₹500-2,500 per unit
    } else {
      return Math.floor(Math.random() * 1000) + 100; // ₹100-1,100 per unit
    }
  };
  
  const getCompetitorName = (index) => {
    const competitors = [
      'AgriMart',
      'FarmSupply Co.',
      'KisanStore',
      'RuralHub',
      'AgroTech',
      'FarmNest',
      'HarvestPlus'
    ];
    return competitors[index % competitors.length];
  };
  
  const getCategoryForProduct = (product) => {
    if (product.includes('Seeds')) return 'Seeds';
    if (product.includes('Urea') || product.includes('DAP') || product.includes('NPK') || 
        product.includes('Manure') || product.includes('nutrient')) return 'Fertilizers';
    if (product.includes('cide') || product.includes('pesticide') || 
        product.includes('Growth')) return 'Pesticides';
    if (product.includes('Tractor') || product.includes('Harvester') || 
        product.includes('Sprayer') || product.includes('Tiller') || 
        product.includes('Thresher')) return 'Farm Equipment';
    if (product.includes('Drip') || product.includes('Sprinkler') || 
        product.includes('Pump') || product.includes('Pipe') || 
        product.includes('Filter')) return 'Irrigation Supplies';
    return 'Other';
  };
  
  const generatePriceRecommendation = (yourPrice, minPrice, avgPrice, maxPrice, isPriceCompetitive) => {
    if (yourPrice === minPrice) {
      return 'Your price is the lowest in the market. Consider a slight increase to improve margins while maintaining competitiveness.';
    } else if (yourPrice > avgPrice * 1.1) {
      return `Your price is significantly higher than market average. Consider reducing price to around ₹${avgPrice} to be more competitive.`;
    } else if (yourPrice < avgPrice * 0.9) {
      return `Your price is well below market average. Consider increasing price closer to ₹${avgPrice} to improve margins.`;
    } else if (isPriceCompetitive) {
      return 'Your price is competitive with the market average. Monitor for any competitor price changes.';
    } else {
      return `Consider adjusting price to around ₹${Math.round(avgPrice * 0.95)} to gain competitive advantage.`;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query) {
      const filteredData = originalPriceData.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
      setPriceData(filteredData);
    } else {
      setPriceData(originalPriceData);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSearchQuery('');
  };

  const handleExportData = () => {
    alert('Export functionality would download price intelligence data as CSV/Excel in a real application');
    // In a real app, this would generate and download a CSV/Excel file
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Competitive Price Intelligence</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2.5"></div>
            <div className="text-sm text-gray-500 mt-2">Analyzing market prices...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Competitive Price Intelligence</h2>
        </div>
        <div className="p-4 text-center text-red-500">
          <p>Error: {error.toString()}</p>
          <button 
            onClick={fetchPriceData} 
            className="mt-4 bg-agri-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      {/* Header with title and export button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FiTrendingUp className="text-agri-green text-xl mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Competitive Price Intelligence</h2>
        </div>
        <button
          onClick={handleExportData}
          className="bg-agri-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
        >
          <FiDownload className="mr-2" /> Export Data
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-md">
        <div className="flex items-center">
          <FiFilter className="text-gray-500 mr-2" />
          <span className="text-sm font-medium mr-2">Category:</span>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-agri-green focus:border-agri-green"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-agri-green focus:border-agri-green text-sm"
          />
        </div>

        <button
          onClick={fetchPriceData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
        >
          <FiRefreshCw className="mr-2" /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">Products Analyzed</h3>
          <p className="text-2xl font-bold text-blue-900">{priceData.length}</p>
          <p className="text-xs text-blue-700 mt-1">
            {priceData.filter(p => !p.marketStats.isPriceCompetitive).length} products need price adjustment
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-sm font-semibold text-green-800 mb-1">Average Market Price</h3>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(priceData.reduce((sum, item) => sum + item.marketStats.avgPrice, 0) / (priceData.length || 1))}
          </p>
          <p className="text-xs text-green-700 mt-1">Across all analyzed products</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="text-sm font-semibold text-purple-800 mb-1">Competitive Position</h3>
          <p className="text-2xl font-bold text-purple-900">
            {Math.round((priceData.filter(p => p.marketStats.isPriceCompetitive).length / (priceData.length || 1)) * 100)}%
          </p>
          <p className="text-xs text-purple-700 mt-1">Products with competitive pricing</p>
        </div>
      </div>

      {/* Product Price Intelligence Cards */}
      <div className="space-y-4">
        {priceData.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className={`p-4 ${product.marketStats.isPriceCompetitive ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{formatCurrency(product.yourPrice)}</div>
                  <div className={`text-sm ${product.marketStats.isPriceCompetitive ? 'text-green-600' : 'text-red-600'}`}>
                    {product.marketStats.pricePosition}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Market Statistics</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Min Price</div>
                    <div className="font-medium">{formatCurrency(product.marketStats.minPrice)}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Avg Price</div>
                    <div className="font-medium">{formatCurrency(product.marketStats.avgPrice)}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Max Price</div>
                    <div className="font-medium">{formatCurrency(product.marketStats.maxPrice)}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Competitor Prices</h4>
                <div className="space-y-2">
                  {product.competitors.map((competitor, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{competitor.name}</span>
                      <div className="flex items-center">
                        <span className="font-medium">{formatCurrency(competitor.price)}</span>
                        <span className={`ml-2 ${competitor.difference > 0 ? 'text-green-600' : competitor.difference < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {competitor.difference > 0 ? '+' : ''}{competitor.difference}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendation</h4>
                <p className="text-sm text-gray-600 p-2 bg-blue-50 rounded">{product.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}