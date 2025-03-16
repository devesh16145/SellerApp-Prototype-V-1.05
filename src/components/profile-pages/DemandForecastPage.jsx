import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { FiTrendingUp, FiCalendar, FiFilter, FiDownload } from 'react-icons/fi';

export default function DemandForecastPage() {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  
  // Categories for agricultural inputs
  const categories = [
    'All',
    'Seeds',
    'Fertilizers',
    'Pesticides',
    'Farm Equipment',
    'Irrigation Supplies'
  ];

  // Timeframes for forecasting
  const timeframes = [
    { label: '30 Days', value: '30' },
    { label: '90 Days', value: '90' },
    { label: '6 Months', value: '180' },
    { label: '1 Year', value: '365' }
  ];

  useEffect(() => {
    fetchForecastData();
  }, [userId, selectedCategory, selectedTimeframe]);

  const fetchForecastData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to an AI forecasting service
      // For this prototype, we'll simulate forecast data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate simulated forecast data
      const simulatedData = generateSimulatedForecastData(selectedCategory, selectedTimeframe);
      setForecastData(simulatedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch forecast data');
      console.error('Error fetching forecast data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSimulatedForecastData = (category, timeframe) => {
    // This function simulates AI-generated forecast data
    // In a real app, this would come from a machine learning model
    
    const days = parseInt(timeframe);
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
    
    // Limit to 10 products if 'All' is selected to avoid overwhelming the UI
    if (category === 'All') {
      selectedProducts = selectedProducts.slice(0, 10);
    }
    
    // Generate forecast data for each product
    selectedProducts.forEach(product => {
      // Base demand (units per month)
      const baseDemand = Math.floor(Math.random() * 1000) + 500;
      
      // Seasonal factors (higher in certain months)
      const currentMonth = new Date().getMonth();
      const seasonalFactor = getSeasionalFactor(product, currentMonth, days);
      
      // Market trend (growing or declining)
      const marketTrend = Math.random() > 0.7 ? -0.05 : 0.1; // 70% chance of growth
      
      // Calculate forecasted demand
      const forecastedDemand = Math.floor(baseDemand * seasonalFactor * (1 + marketTrend));
      
      // Calculate confidence level (higher for shorter timeframes)
      const confidenceLevel = Math.floor(95 - (days / 30) * 5);
      
      // Calculate potential revenue (price * forecasted demand)
      const avgPrice = getAveragePrice(product);
      const potentialRevenue = forecastedDemand * avgPrice;
      
      // Growth compared to previous period
      const previousPeriodDemand = Math.floor(baseDemand * 0.9); // Assume 10% less in previous period
      const growthRate = ((forecastedDemand - previousPeriodDemand) / previousPeriodDemand) * 100;
      
      products.push({
        id: Math.random().toString(36).substr(2, 9),
        name: product,
        category: getCategoryForProduct(product),
        forecastedDemand,
        confidenceLevel,
        potentialRevenue,
        growthRate: parseFloat(growthRate.toFixed(1)),
        seasonalFactors: getSeasonalFactorsText(product),
        marketInsights: getMarketInsights(product, growthRate),
        recommendedAction: getRecommendedAction(growthRate, confidenceLevel)
      });
    });
    
    // Sort by potential revenue (highest first)
    return products.sort((a, b) => b.potentialRevenue - a.potentialRevenue);
  };
  
  // Helper functions for generating realistic data
  const getSeasionalFactor = (product, currentMonth, days) => {
    // Different products have different seasonal patterns
    if (product.includes('Seeds')) {
      // Seeds demand peaks before sowing seasons
      return currentMonth >= 2 && currentMonth <= 4 ? 1.5 : 
             currentMonth >= 8 && currentMonth <= 10 ? 1.3 : 1.0;
    } else if (product.includes('Fertilizer') || product.includes('Pesticide')) {
      // Fertilizers and pesticides peak during growing seasons
      return currentMonth >= 5 && currentMonth <= 8 ? 1.4 : 1.0;
    } else if (product.includes('Equipment')) {
      // Equipment purchases often happen before harvest seasons
      return currentMonth >= 1 && currentMonth <= 3 ? 1.3 : 
             currentMonth >= 7 && currentMonth <= 9 ? 1.2 : 1.0;
    } else {
      // Default seasonal pattern
      return 1.0 + (Math.sin(currentMonth / 12 * 2 * Math.PI) * 0.2);
    }
  };
  
  const getAveragePrice = (product) => {
    // Simulated average prices for different product types
    if (product.includes('Seeds')) {
      return Math.floor(Math.random() * 500) + 200; // ₹200-700 per unit
    } else if (product.includes('Fertilizer')) {
      return Math.floor(Math.random() * 300) + 100; // ₹100-400 per unit
    } else if (product.includes('Pesticide')) {
      return Math.floor(Math.random() * 400) + 150; // ₹150-550 per unit
    } else if (product.includes('Equipment')) {
      return Math.floor(Math.random() * 50000) + 10000; // ₹10,000-60,000 per unit
    } else if (product.includes('Irrigation')) {
      return Math.floor(Math.random() * 2000) + 500; // ₹500-2,500 per unit
    } else {
      return Math.floor(Math.random() * 1000) + 100; // ₹100-1,100 per unit
    }
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
  
  const getSeasonalFactorsText = (product) => {
    // Generate text about seasonal factors affecting demand
    const category = getCategoryForProduct(product);
    const currentMonth = new Date().getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (category === 'Seeds') {
      if (currentMonth >= 2 && currentMonth <= 4) {
        return `High demand expected due to Kharif sowing season (${monthNames[currentMonth]} to ${monthNames[(currentMonth + 2) % 12]})`;
      } else if (currentMonth >= 8 && currentMonth <= 10) {
        return `High demand expected due to Rabi sowing season (${monthNames[currentMonth]} to ${monthNames[(currentMonth + 2) % 12]})`;
      } else {
        return 'Normal seasonal demand expected';
      }
    } else if (category === 'Fertilizers' || category === 'Pesticides') {
      if (currentMonth >= 5 && currentMonth <= 8) {
        return `Peak demand during growing season (${monthNames[currentMonth]} to ${monthNames[(currentMonth + 2) % 12]})`;
      } else {
        return 'Moderate demand expected based on crop cycles';
      }
    } else if (category === 'Farm Equipment') {
      if (currentMonth >= 1 && currentMonth <= 3 || currentMonth >= 7 && currentMonth <= 9) {
        return `Higher demand before harvest seasons (${monthNames[currentMonth]} to ${monthNames[(currentMonth + 2) % 12]})`;
      } else {
        return 'Standard equipment replacement and upgrade cycle';
      }
    } else {
      return 'Regular seasonal patterns apply';
    }
  };
  
  const getMarketInsights = (product, growthRate) => {
    // Generate market insights based on product and growth rate
    const insights = [
      `Market ${growthRate > 0 ? 'growing' : 'declining'} at ${Math.abs(growthRate).toFixed(1)}%`,
      growthRate > 10 ? 'Strong upward trend in farmer adoption' : 
      growthRate > 0 ? 'Steady demand from regular customers' : 
      'Consider promotional strategies to boost sales',
    ];
    
    // Add product-specific insights
    if (product.includes('Organic') || product.includes('Bio')) {
      insights.push('Growing interest in organic and sustainable options');
    }
    if (product.includes('Equipment')) {
      insights.push('Government subsidies may be driving equipment purchases');
    }
    if (product.includes('Irrigation')) {
      insights.push('Water conservation concerns increasing demand for efficient systems');
    }
    
    return insights.join('. ');
  };
  
  const getRecommendedAction = (growthRate, confidenceLevel) => {
    // Generate recommended actions based on growth rate and confidence level
    if (growthRate > 15 && confidenceLevel > 85) {
      return 'Increase inventory levels by 20-30% to meet growing demand';
    } else if (growthRate > 5) {
      return 'Moderate inventory increase of 10-15% recommended';
    } else if (growthRate > -5) {
      return 'Maintain current inventory levels with regular monitoring';
    } else if (growthRate > -15) {
      return 'Consider reducing inventory by 10-15% to avoid excess stock';
    } else {
      return 'Significant inventory reduction recommended; focus on clearing existing stock';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExportData = () => {
    alert('Export functionality would download forecast data as CSV/Excel in a real application');
    // In a real app, this would generate and download a CSV/Excel file
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">AI Demand Forecast</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2.5"></div>
            <div className="text-sm text-gray-500 mt-2">Analyzing market trends and seasonal patterns...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">AI Demand Forecast</h2>
        </div>
        <div className="p-4 text-center text-red-500">
          <p>Error: {error.toString()}</p>
          <button 
            onClick={fetchForecastData} 
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
          <h2 className="text-xl font-bold text-gray-800">AI Demand Forecast</h2>
        </div>
        <button
          onClick={handleExportData}
          className="bg-agri-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
        >
          <FiDownload className="mr-2" /> Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-md">
        <div className="flex items-center">
          <FiCalendar className="text-gray-500 mr-2" />
          <span className="text-sm font-medium mr-2">Timeframe:</span>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-agri-green focus:border-agri-green"
          >
            {timeframes.map((timeframe) => (
              <option key={timeframe.value} value={timeframe.value}>
                {timeframe.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <FiFilter className="text-gray-500 mr-2" />
          <span className="text-sm font-medium mr-2">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-agri-green focus:border-agri-green"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">Total Forecasted Demand</h3>
          <p className="text-2xl font-bold text-blue-900">
            {forecastData.reduce((sum, item) => sum + item.forecastedDemand, 0).toLocaleString()} units
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Across {forecastData.length} products in selected categories
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-sm font-semibold text-green-800 mb-1">Potential Revenue</h3>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(forecastData.reduce((sum, item) => sum + item.potentialRevenue, 0))}
          </p>
          <p className="text-xs text-green-700 mt-1">
            Based on current market prices and forecasted demand
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="text-sm font-semibold text-purple-800 mb-1">Average Confidence Level</h3>
          <p className="text-2xl font-bold text-purple-900">
            {Math.round(forecastData.reduce((sum, item) => sum + item.confidenceLevel, 0) / (forecastData.length || 1))}%
          </p>
          <p className="text-xs text-purple-700 mt-1">
            AI prediction confidence based on historical data patterns
          </p>
        </div>
      </div>

      {/* Product Forecast Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Forecasted Demand
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Growth Rate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Potential Revenue
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {forecastData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.forecastedDemand.toLocaleString()} units</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${item.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.growthRate > 0 ? '+' : ''}{item.growthRate}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatCurrency(item.potentialRevenue)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.confidenceLevel}%</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed Insights */}
      {forecastData.length > 0 && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Detailed Insights & Recommendations</h3>
          <div className="space-y-4">
            {forecastData.slice(0, 3).map((item) => (
              <div key={`insight-${item.id}`} className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Seasonal Factors:</h5>
                    <p className="text-sm text-gray-600">{item.seasonalFactors}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Market Insights:</h5>
                    <p className="text-sm text-gray-600">{item.marketInsights}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Recommended Action:</h5>
                    <p className="text-sm text-gray-600 font-medium">{item.recommendedAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}