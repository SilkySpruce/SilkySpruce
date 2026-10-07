"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

// Database types for our UI
interface OrderItem {
  id: string;
  product_name: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  
  // PROPER HYDRATION FIX
  const [isMounted, setIsMounted] = useState(false);

  // Security Check: Only allow your specific admin email
  const isAdmin = isAuthenticated && user?.email === 'fountaincreations@gmail.com';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && isAdmin) {
      fetchOrders();
    } else if (isMounted && !isAdmin) {
      setLoading(false);
    }
  }, [isMounted, isAdmin]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } else {
      alert("Failed to update order status.");
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter(id => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={16} className="text-yellow-500" />;
      case 'Processing': return <Package size={16} className="text-blue-500" />;
      case 'Shipped': return <Truck size={16} className="text-purple-500" />;
      case 'Delivered': return <CheckCircle size={16} className="text-green-500" />;
      case 'Cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} />;
    }
  };

  // Prevent rendering until hydration is complete
  if (!isMounted) return <div className="loading-state">Authenticating...</div>;

  // --- ACCESS DENIED STATE ---
  if (!isAdmin) {
    return (
      <div className="admin-denied-container">
        <h2>Restricted Area</h2>
        <p>You do not have administrative privileges to view this page.</p>
        <Link href="/account" className="back-link">Return to My Account</Link>
        <AdminStyles />
      </div>
    );
  }

  // --- ADMIN DASHBOARD STATE ---
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Fulfillment Dashboard</h1>
        <p className="admin-subtitle">Manage incoming orders and update delivery statuses.</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading secure order data...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <Package size={48} className="empty-icon" />
          <p>No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="admin-order-card">
              
              <div className="order-summary-row">
                <div className="order-main-info">
                  <h3 className="order-number">#{order.order_number}</h3>
                  <p className="order-date">{new Date(order.created_at).toLocaleString()}</p>
                </div>

                <div className="order-customer-info">
                  <p className="customer-name">{order.customer_name}</p>
                  <p className="customer-contact">{order.customer_email}</p>
                </div>

                <div className="order-total-info">
                  <p className="order-total">KSh {order.total_amount}</p>
                  <p className="item-count">{order.order_items?.length || 0} items</p>
                </div>

                <div className="order-status-selector">
                  <div className="status-badge-wrapper">
                    {getStatusIcon(order.status)}
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`status-select status-${order.status.toLowerCase()}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <button 
                  className="expand-btn" 
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  {expandedOrders.includes(order.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {/* EXPANDED ORDER DETAILS */}
              {expandedOrders.includes(order.id) && (
                <div className="order-expanded-details">
                  <div className="details-grid">
                    <div className="delivery-info">
                      <h4>Delivery Details</h4>
                      <p>{order.shipping_address}</p>
                      <p>Phone: {order.customer_phone}</p>
                    </div>

                    <div className="items-info">
                      <h4>Purchased Items</h4>
                      <div className="items-list">
                        {order.order_items?.map(item => (
                          <div key={item.id} className="item-row">
                            <span className="item-qty">{item.quantity}x</span>
                            <span className="item-name">{item.product_name} <span className="item-size">({item.size})</span></span>
                            <span className="item-price">KSh {item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      <AdminStyles />
    </div>
  );
}

const AdminStyles = () => (
  <style>{`
    .admin-container {
      width: 100%;
      max-width: 80rem;
      margin: 0 auto;
      padding: 4rem 2rem 8rem;
    }

    .admin-denied-container {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .admin-denied-container h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #ef4444;
      margin-bottom: 1rem;
    }

    .admin-denied-container p {
      color: #9ca3af;
      margin-bottom: 2rem;
    }

    .back-link {
      background-color: #788E7D;
      color: #ffffff;
      padding: 1rem 2rem;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }

    .back-link:hover {
      background-color: #687C6D;
    }

    .admin-header {
      margin-bottom: 3rem;
      border-bottom: 1px solid #2A2A2A;
      padding-bottom: 2rem;
    }

    .admin-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }

    .admin-subtitle {
      color: #9ca3af;
      font-size: 1rem;
    }

    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6rem 0;
      color: #9ca3af;
    }

    .empty-icon {
      color: #2A2A2A;
      margin-bottom: 1rem;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .admin-order-card {
      border: 1px solid #2A2A2A;
      background: #111111;
      display: flex;
      flex-direction: column;
    }

    .order-summary-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .order-main-info {
      flex: 1;
      min-width: 120px;
    }

    .order-number {
      font-size: 1.125rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.25rem;
    }

    .order-date {
      font-size: 0.75rem;
      color: #6b7280;
      letter-spacing: 0.05em;
    }

    .order-customer-info {
      flex: 2;
      min-width: 150px;
    }

    .customer-name {
      font-weight: 600;
      color: #d1d5db;
      margin-bottom: 0.25rem;
    }

    .customer-contact {
      font-size: 0.875rem;
      color: #9ca3af;
    }

    .order-total-info {
      flex: 1;
      min-width: 100px;
      text-align: right;
    }

    .order-total {
      font-weight: 700;
      color: #ffffff;
      font-size: 1.125rem;
      margin-bottom: 0.25rem;
    }

    .item-count {
      font-size: 0.875rem;
      color: #9ca3af;
    }

    .order-status-selector {
      flex: 1;
      min-width: 140px;
    }

    .status-badge-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.5rem;
      border: 1px solid #2A2A2A;
      border-radius: 4px;
    }

    .status-select {
      background: transparent;
      color: #ffffff;
      border: none;
      outline: none;
      font-weight: 600;
      font-size: 0.875rem;
      width: 100%;
      cursor: pointer;
    }

    .status-select option {
      background: #111111;
      color: #ffffff;
    }

    .status-pending { color: #eab308; }
    .status-processing { color: #3b82f6; }
    .status-shipped { color: #a855f7; }
    .status-delivered { color: #22c55e; }
    .status-cancelled { color: #ef4444; }

    .expand-btn {
      background: transparent;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    }

    .expand-btn:hover {
      color: #ffffff;
    }

    .order-expanded-details {
      border-top: 1px solid #2A2A2A;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.01);
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .details-grid {
        grid-template-columns: 1fr 2fr;
      }
    }

    .delivery-info h4, .items-info h4 {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #6b7280;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .delivery-info p {
      color: #d1d5db;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px dashed #2A2A2A;
      padding-bottom: 0.75rem;
    }

    .item-qty {
      font-weight: 700;
      color: #788E7D;
      min-width: 2rem;
    }

    .item-name {
      flex: 1;
      color: #ffffff;
      font-size: 0.875rem;
    }

    .item-size {
      color: #6b7280;
    }

    .item-price {
      font-weight: 600;
      color: #ffffff;
      font-size: 0.875rem;
    }
  `}</style>
);