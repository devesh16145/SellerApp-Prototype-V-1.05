import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiRefreshCw, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { FaMedal, FaFire } from 'react-icons/fa';

export default function SellerLeaderboardPage({ setActivePage }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [originalLeaderboardData, setOriginalLeaderboardData] = useState([]); // To hold original data for refresh/reset

  useEffect(() => {
    setActivePage('leaderboard');
    fetchLeaderboard();
  }, [userId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    console.log("Fetching leaderboard data...");

    try {
      if (!userId) {
        setError("User ID not found.");
        setLoading(false);
        console.log("User ID not found, cannot fetch leaderboard.");
        return;
      }
      console.log("User ID:", userId);

      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('rank', { ascending: true });

      if (error) {
        setError(error);
        console.error("Supabase error fetching leaderboard:", error);
      } else {
        console.log("Raw Supabase data:", data);
        setLeaderboardData(data);
        setOriginalLeaderboardData(data); // Store the original data
        console.log("Leaderboard data fetched successfully:", data);
      }
    } catch (err) {
      setError(err);
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
      console.log("Fetching leaderboard data completed.");
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (!originalLeaderboardData) {
      setOriginalLeaderboardData(leaderboardData);
    }
    if (query) {
      const filteredData = originalLeaderboardData.filter(seller =>
        seller.seller_name.toLowerCase().includes(query)
      );
      setLeaderboardData(filteredData);
    } else {
      setLeaderboardData(originalLeaderboardData); // Reset to original data when query is cleared
    }
  };

  const handleRefresh = () => {
    fetchLeaderboard();
    setSearchQuery(''); // Clear search query on refresh
  };


  if (loading) {
    console.log("Leaderboard is loading...");
    return <div className="p-4">Loading leaderboard data...</div>;
  }

  if (error) {
    console.error("Leaderboard error during render:", error);
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  console.log("Leaderboard rendering with data:", leaderboardData);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Seller Leaderboard</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search seller..."
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-agri-green focus:border-agri-green sm:text-sm"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="bg-agri-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center space-x-2"
          >
            <FiRefreshCw /> <span>Refresh</span>
          </button>
        </div>
      </div>


      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKUs</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fulfillment</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.map((seller, index) => (
              <tr
                key={seller.id}
                className={`transition-all duration-300 hover:bg-gray-50 ${seller.profile_id === userId ? 'bg-green-50' : ''}`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      {index < 3 ? <FaMedal className="text-lg" /> : index + 1}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-gray-900">{seller.seller_name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      {seller.rank_change > 0 ? (
                        <><FiTrendingUp className="text-green-500" /> +{seller.rank_change}</>
                      ) : seller.rank_change < 0 ? (
                        <><FiTrendingDown className="text-red-500" /> {seller.rank_change}</>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold">{seller.sku_count}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold">{seller.competitive_pricing_score}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold">₹{seller.sales_volume}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold">{seller.order_fulfillment_rate}%</td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  {index < 3 && <FaFire className="text-orange-500 text-lg animate-pulse" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
