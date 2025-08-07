import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download, TrendingUp, MessageSquare, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCustomers, mockProducts, mockBlasts } from "@/data/mockData";

const Reports = () => {
  // Mock data for charts
  const campaignData = [
    { name: "Week 1", sent: 45, opened: 32, clicked: 18 },
    { name: "Week 2", sent: 52, opened: 41, clicked: 24 },
    { name: "Week 3", sent: 38, opened: 29, clicked: 15 },
    { name: "Week 4", sent: 61, opened: 48, clicked: 31 },
  ];

  const categoryData = [
    { name: "Notebooks", value: 35, color: "#3b82f6" },
    { name: "Pens", value: 25, color: "#10b981" },
    { name: "Paper", value: 20, color: "#f59e0b" },
    { name: "Accessories", value: 20, color: "#ef4444" },
  ];

  const engagementData = [
    { month: "Jan", rate: 68 },
    { month: "Feb", rate: 72 },
    { month: "Mar", rate: 75 },
    { month: "Apr", rate: 71 },
    { month: "May", rate: 78 },
    { month: "Jun", rate: 82 },
  ];

  const topCustomers = mockCustomers
    .sort((a, b) => b.budget - a.budget)
    .slice(0, 5);

  const topProducts = mockProducts
    .sort((a, b) => b.price * b.stock - a.price * a.stock)
    .slice(0, 5);

  const handleExportData = () => {
    // Mock export functionality
    const data = {
      customers: mockCustomers.length,
      products: mockProducts.length,
      campaigns: mockBlasts.length,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stationery-connect-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
          <p className="text-muted-foreground">Track your business performance</p>
        </div>
        <Button onClick={handleExportData}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages Sent</p>
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-xs text-success">+12% from last month</p>
              </div>
              <MessageSquare className="h-8 w-8 text-soft-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Open Rate</p>
                <p className="text-2xl font-bold text-foreground">78.5%</p>
                <p className="text-xs text-success">+5.2% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-soft-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold text-foreground">{mockCustomers.length}</p>
                <p className="text-xs text-success">+3 new this month</p>
              </div>
              <Users className="h-8 w-8 text-soft-pink" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Products Shared</p>
                <p className="text-2xl font-bold text-foreground">89</p>
                <p className="text-xs text-warning">-2% from last month</p>
              </div>
              <Package className="h-8 w-8 text-soft-beige" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
                <Bar dataKey="opened" fill="#10b981" name="Opened" />
                <Bar dataKey="clicked" fill="#f59e0b" name="Clicked" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Product Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categoryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-muted-foreground">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers by Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-soft-blue flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{customer.budget.toLocaleString()}</div>
                    <Badge variant={
                      customer.group === "Premium" ? "default" :
                      customer.group === "Rural" ? "secondary" : 
                      "outline"
                    }>
                      {customer.group}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products by Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-8 h-8 rounded-full bg-soft-green flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{product.name}</div>
                  <div className="text-sm text-muted-foreground">₹{product.price} × {product.stock}</div>
                  <div className="text-sm font-bold text-success">
                    ₹{(product.price * product.stock).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;