// Mock data for the CRM platform

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  tags: string[];
  stock: number;
  in_stock: boolean;
}

export interface Customer {
  id: string;
  name: string;
  location: string;
  budget: number;
  interests: string[];
  whatsappNumber: string;
  group: "Premium" | "Rural" | "Budget Buyers";
  lastContact: string;
}

export interface WhatsAppBlast {
  id: string;
  customerIds: string[];
  productIds: string[];
  message: string;
  status: "sent" | "pending" | "failed";
  sentAt: string;
  openRate: number;
}

export interface ActivityLog {
  id: string;
  type: "product_shared" | "customer_added" | "blast_sent";
  description: string;
  timestamp: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Notebooks Set (Pack of 10)",
    category: "Notebooks",
    price: 450,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
    tags: ["school", "premium", "bulk"],
    stock: 150,
    in_stock: true,
  },
  {
    id: "2",
    name: "Gel Pen Collection - Blue/Black",
    category: "Pens",
    price: 120,
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=300&fit=crop",
    tags: ["office", "writing", "bulk"],
    stock: 0,
    in_stock: false,
  },
  {
    id: "3",
    name: "A4 Copy Paper (500 sheets)",
    category: "Paper",
    price: 280,
    image: "https://images.unsplash.com/photo-1586281010923-cf0c1739bbc5?w=300&h=300&fit=crop",
    tags: ["office", "printing", "bulk"],
    stock: 75,
    in_stock: true,
  },
  {
    id: "4",
    name: "Highlighter Markers Set",
    category: "Markers",
    price: 85,
    image: "https://images.unsplash.com/photo-1516486927352-e99b70933faa?w=300&h=300&fit=crop",
    tags: ["school", "office", "colorful"],
    stock: 200,
    in_stock: true,
  },
  {
    id: "5",
    name: "Executive Diary 2024",
    category: "Diaries",
    price: 320,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    tags: ["premium", "office", "planning"],
    stock: 45,
    in_stock: true,
  },
  {
    id: "6",
    name: "Pencil Box Combo",
    category: "Accessories",
    price: 180,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop",
    tags: ["school", "kids", "combo"],
    stock: 90,
    in_stock: true,
  },
];

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Rajesh Stationers",
    location: "Mumbai, Maharashtra",
    budget: 25000,
    interests: ["school", "office", "premium"],
    whatsappNumber: "+91 98765 43210",
    group: "Premium",
    lastContact: "2024-01-15",
  },
  {
    id: "2",
    name: "Shah Books & Stationery",
    location: "Ahmedabad, Gujarat",
    budget: 15000,
    interests: ["school", "kids", "bulk"],
    whatsappNumber: "+91 87654 32109",
    group: "Budget Buyers",
    lastContact: "2024-01-10",
  },
  {
    id: "3",
    name: "Office Plus Solutions",
    location: "Bangalore, Karnataka",
    budget: 40000,
    interests: ["office", "premium", "printing"],
    whatsappNumber: "+91 76543 21098",
    group: "Premium",
    lastContact: "2024-01-12",
  },
  {
    id: "4",
    name: "Village School Supplies",
    location: "Nashik, Maharashtra",
    budget: 8000,
    interests: ["school", "rural", "affordable"],
    whatsappNumber: "+91 65432 10987",
    group: "Rural",
    lastContact: "2024-01-08",
  },
  {
    id: "5",
    name: "Metro Stationery Hub",
    location: "Delhi, NCR",
    budget: 30000,
    interests: ["office", "bulk", "premium"],
    whatsappNumber: "+91 54321 09876",
    group: "Premium",
    lastContact: "2024-01-14",
  },
];

export const mockBlasts: WhatsAppBlast[] = [
  {
    id: "1",
    customerIds: ["1", "3", "5"],
    productIds: ["1", "3", "5"],
    message: "New premium collection available! Check out our latest notebooks and diaries.",
    status: "sent",
    sentAt: "2024-01-15T10:30:00Z",
    openRate: 85,
  },
  {
    id: "2",
    customerIds: ["2", "4"],
    productIds: ["2", "4", "6"],
    message: "Back to school special offers! Great deals on pens and accessories.",
    status: "sent",
    sentAt: "2024-01-14T14:15:00Z",
    openRate: 72,
  },
  {
    id: "3",
    customerIds: ["1", "2", "3"],
    productIds: ["3"],
    message: "Office paper stock available - bulk discounts applicable!",
    status: "pending",
    sentAt: "2024-01-16T09:00:00Z",
    openRate: 0,
  },
];

export const mockActivities: ActivityLog[] = [
  {
    id: "1",
    type: "blast_sent",
    description: "WhatsApp blast sent to 3 premium customers",
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    type: "customer_added",
    description: "New customer 'Metro Stationery Hub' added",
    timestamp: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    type: "product_shared",
    description: "Executive Diary shared with Rajesh Stationers",
    timestamp: "2024-01-14T16:20:00Z",
  },
  {
    id: "4",
    type: "blast_sent",
    description: "Back to school campaign sent to budget customers",
    timestamp: "2024-01-14T14:15:00Z",
  },
  {
    id: "5",
    type: "customer_added",
    description: "New rural customer 'Village School Supplies' added",
    timestamp: "2024-01-14T11:30:00Z",
  },
];