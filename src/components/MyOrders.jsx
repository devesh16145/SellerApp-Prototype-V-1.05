import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiPackage, FiClock, FiTruck, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Timer = ({ minutes }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60); // Convert minutes to seconds

  useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  if (timeLeft <= 0) {
    return <span className="text-white text-xs font-bold">Time's up!</span>;
  }

  const displayMinutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;
  const formattedTime = `${String(displayMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  return (
    <span className="text-white text-xs font-bold">{formattedTime}</span>
  );
};

export default function MyOrders() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [orders, setOrders] = useState([]); // State to hold orders from Supabase
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth(); // Get userId from AuthContext

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Modified Supabase query to fetch Time_to_Pack
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            Time_to_Pack,
            order_items (
              *,
              products (
                name
              )
            )
          `)
          .eq('seller_id', userId); // Filter orders by seller_id (user's profile ID)

        if (error) {
          console.error('Error fetching orders:', error);
        } else {
          // Sort orders to place "New" status orders at the beginning
          const sortedOrders = data.sort((a, b) => {
            if (a.status === 'New' && b.status !== 'New') {
              return -1; // a comes before b
            }
            if (a.status !== 'New' && b.status === 'New') {
              return 1; // b comes before a
            }
            return 0; // No change in order
          });
          setOrders(sortedOrders);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) { // Fetch orders only if userId is available
      fetchOrders();
    }
  }, [userId]);

  const handleAccept = (orderId) => {
    console.log(`Accepting order: ${orderId}`);
  };

  const handlePack = (orderId) => {
    console.log(`Packing order: ${orderId}`);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredOrders = orders.filter(order => {
    if (!order || !order.order_items) return false;

    const query = searchQuery.toLowerCase();
    const itemMatch = order.order_items.some(item =>
      item.products?.name?.toLowerCase().includes(query)
    );
    const orderIdMatch = order.order_number.toLowerCase().includes(query);
    const statusMatch = activeTab === 'All' || order.status === activeTab;
    return statusMatch && (itemMatch || orderIdMatch);
  });


  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return <div>Loading Orders...</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <h2 className="font-bold text-xl text-gray-800">My Orders</h2>
        <div className="flex items-center space-x-2">
          {searchOpen ? (
            <div className="flex items-center shadow-sm">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-gray-200 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green w-64 placeholder-gray-400"
              />
              <button onClick={toggleSearch} className="bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-r-lg px-4 py-2 border border-l-0 border-gray-200">
                <FiX className="text-lg" />
              </button>
            </div>
          ) : (
            <button onClick={toggleSearch} className="bg-agri-green hover:bg-green-600 text-white rounded-lg p-2.5 shadow-sm transition-colors">
              <FiSearch className="text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50 px-2">
        {['All', 'New', 'Pending', 'Shipped', 'Delivered'].map(tab => {
          const getTabIcon = () => {
            switch(tab) {
              case 'New': return <FiAlertCircle className="mr-1.5" />;
              case 'Pending': return <FiClock className="mr-1.5" />;
              case 'Shipped': return <FiTruck className="mr-1.5" />;
              case 'Delivered': return <FiCheck className="mr-1.5" />;
              default: return <FiPackage className="mr-1.5" />;
            }
          };
          return (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
                activeTab === tab 
                  ? 'text-agri-green border-b-2 border-agri-green bg-white' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {getTabIcon()}
              {tab}
            </button>
          );
        })}
      </div>

      <div className="p-4 space-y-4">
        {paginatedOrders.map(order => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg relative shadow-sm hover:shadow-md transition-shadow">
            {(order.status === "New" || order.status === "Pending") && (
              <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-between px-4 rounded-t-lg">
                <div className="flex items-center">
                  <FiClock className="text-white mr-2" />
                  <span className="text-sm text-white font-medium">Time Left to Pack:</span>
                </div>
                <div className='flex items-center gap-3'>
                  <Timer minutes={order.Time_to_Pack} />
                </div>
              </div>
            )}

            <div className="p-4 pt-12 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-base text-gray-800">{order.order_number}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{order.order_date}</div>
                </div>
                <span className={`inline-block ${getStatusBgColor(order.status)} text-white text-[0.6rem] px-2 py-0.5 rounded-full font-semibold`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                {order.order_items && order.order_items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiPackage className="text-gray-400 mr-2" />
                      <span className="font-medium text-sm text-gray-700">{item.products.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded">
                      x {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Total:</span>
                  <span className="text-base font-semibold text-gray-800">₹{order.total_amount}</span>
                </div>
                {order.status !== "Shipped" && (
                  <div className="flex space-x-2">
                    {order.status === "New" && (
                      <button
                        onClick={() => handleAccept(order.order_number)}
                        className="bg-agri-green hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center transition-colors"
                      >
                        <FiCheck className="mr-1.5" />
                        Accept
                      </button>
                    )}
                    {order.status !== "New" && order.status !== "Delivered" && (
                      <button
                        onClick={() => handlePack(order.order_number)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center transition-colors"
                      >
                        <FiPackage className="mr-1.5" />
                        Pack
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:hover:bg-white transition-colors"
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:hover:bg-white transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

const getStatusBgColor = (status) => {
  switch (status) {
    case "New":
      return "bg-green-500";
    case "Pending":
      return "bg-orange-500";
    case "Shipped":
      return "bg-blue-500";
    case "Delivered":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};
