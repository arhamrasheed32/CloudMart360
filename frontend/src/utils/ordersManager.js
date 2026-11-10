// Order Management & Notification Storage for CloudMart 360 Admin
const ORDERS_STORAGE_KEY = 'cloudmart_orders_v1';
const NOTIFS_STORAGE_KEY = 'cloudmart_notifs_v1';

const INITIAL_ORDERS = [
  {
    orderId: 'CM360-ORD-892140',
    date: 'Today, 10:14 AM',
    customer: 'Jane Doe',
    email: 'jane.doe@example.com',
    address: '742 Evergreen Terrace, San Francisco, CA 94107',
    carrier: 'FedEx Express Worldwide',
    trackingNumber: 'FDX-99201948210',
    status: 'Out for Delivery',
    grandTotal: 249.99,
    items: [
      {
        product: {
          id: 'prod-001-aura-pro',
          name: 'Aura Pro Noise Cancelling Headphones',
          price: 249.99,
          sku: 'CM-ELE-AUR-9021',
          category: 'Electronics',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
        },
        quantity: 1
      }
    ]
  },
  {
    orderId: 'CM360-ORD-741902',
    date: 'Yesterday, 04:32 PM',
    customer: 'Marcus Vance',
    email: 'marcus.v@apextech.io',
    address: '104 Innovation Way, Suite 400, Austin, TX 78701',
    carrier: 'UPS Air Freight',
    trackingNumber: 'UPS-78912401829',
    status: 'Delivered',
    grandTotal: 839.49,
    items: [
      {
        product: {
          id: 'prod-008-o5p6',
          name: 'Quantum 4K Ultra-Wide Curved Monitor 34"',
          price: 649.99,
          sku: 'CM-ELE-MON-9952',
          category: 'Electronics',
          imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'
        },
        quantity: 1
      },
      {
        product: {
          id: 'prod-002-c3d4',
          name: 'UltraLite Smart Fitness Watch Series 5',
          price: 189.5,
          sku: 'CM-ELE-WAT-4812',
          category: 'Electronics',
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'
        },
        quantity: 1
      }
    ]
  },
  {
    orderId: 'CM360-ORD-612984',
    date: 'Nov 08, 01:15 PM',
    customer: 'Elena Rostova',
    email: 'elena.rostova@designlab.org',
    address: '450 West 33rd St, New York, NY 10001',
    carrier: 'DHL Express Global',
    trackingNumber: 'DHL-3381920192',
    status: 'Processing',
    grandTotal: 283.0,
    items: [
      {
        product: {
          id: 'prod-003-e5f6',
          name: 'Merino Wool Ergonomic Tech Hoodie',
          price: 128.0,
          sku: 'CM-APP-MER-1193',
          category: 'Apparel & Fashion',
          imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80'
        },
        quantity: 1
      },
      {
        product: {
          id: 'prod-004-g7h8',
          name: 'Precision Barista Electric Gooseneck Kettle',
          price: 155.0,
          sku: 'CM-HOM-BAR-7734',
          category: 'Home & Kitchen',
          imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&q=80'
        },
        quantity: 1
      }
    ]
  },
  {
    orderId: 'CM360-ORD-519203',
    date: 'Nov 07, 11:45 AM',
    customer: 'David Kim',
    email: 'dkim@cloudnative.dev',
    address: '88 King St E, Toronto, ON M5C 1G5',
    carrier: 'FedEx International Ground',
    trackingNumber: 'FDX-88291049210',
    status: 'Pending',
    grandTotal: 223.0,
    items: [
      {
        product: {
          id: 'prod-005-i9j0',
          name: 'HyperGrip Carbon Trail Running Shoes',
          price: 175.0,
          sku: 'CM-SPO-HYP-3301',
          category: 'Sports & Outdoors',
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'
        },
        quantity: 1
      },
      {
        product: {
          id: 'prod-007-m3n4',
          name: 'Minimalist Top-Grain Leather Cardholder',
          price: 48.0,
          sku: 'CM-ACC-LEA-8810',
          category: 'Accessories',
          imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80'
        },
        quantity: 1
      }
    ]
  }
];

export function getStoredOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse orders from localStorage', e);
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrder(order) {
  try {
    const orders = getStoredOrders();
    const updated = [order, ...orders];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
    return [];
  }
}

export function updateStoredOrderStatus(orderId, newStatus) {
  try {
    const orders = getStoredOrders();
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update order status in localStorage', e);
    return [];
  }
}

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'warning',
    category: 'Inventory',
    title: 'Low Stock Alert: Smart WiFi Aroma Diffuser',
    message: 'Only 3 units remaining in stock. Threshold is 10 units.',
    time: '12 minutes ago',
    read: false
  },
  {
    id: 'notif-2',
    type: 'danger',
    category: 'Inventory',
    title: 'Out of Stock: Botanical Anti-Aging Peptide Serum',
    message: 'Stock level reached 0. Instant notification sent to inventory supplier.',
    time: '45 minutes ago',
    read: false
  },
  {
    id: 'notif-3',
    type: 'success',
    category: 'Order',
    title: 'New Customer Order Confirmed: CM360-ORD-892140',
    message: 'Order totaling $249.99 successfully verified and routed to fulfillment center.',
    time: '2 hours ago',
    read: true
  },
  {
    id: 'notif-4',
    type: 'info',
    category: 'Security',
    title: 'Admin Authentication Verified via Amazon Cognito',
    message: 'Master Administrator authenticated with elevated group privileges (Admins).',
    time: '3 hours ago',
    read: true
  },
  {
    id: 'notif-5',
    type: 'info',
    category: 'Database',
    title: 'Amazon DynamoDB DocumentClient Sync Complete',
    message: 'Sub-10ms atomic transaction sync confirmed across 12 catalog items.',
    time: '4 hours ago',
    read: true
  }
];

export function getStoredNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse notifications from localStorage', e);
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs) {
  try {
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to save notifications to localStorage', e);
  }
}
