import { Package, Users, Send, DollarSign, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OverviewCard from "@/components/Dashboard/OverviewCard";
import { mockProducts, mockCustomers, mockBlasts, mockActivities } from "@/data/mockData";

const Dashboard = () => {
  const totalProducts = mockProducts.length;
  const totalCustomers = mockCustomers.length;
  const pendingBlasts = mockBlasts.filter(b => b.status === "pending").length;
  const inventoryValue = mockProducts.reduce((total, product) => 
    total + (product.price * product.stock), 0);

  const avgOpenRate = mockBlasts
    .filter(b => b.status === "sent")
    .reduce((total, blast) => total + blast.openRate, 0) / 
    mockBlasts.filter(b => b.status === "sent").length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Total Products"
          value={totalProducts}
          description="Active inventory items"
          icon={Package}
          trend={{ value: 12, isPositive: true }}
          className="bg-gradient-to-br from-soft-blue to-card"
        />
        <OverviewCard
          title="Total Customers"
          value={totalCustomers}
          description="Registered retailers"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          className="bg-gradient-to-br from-soft-green to-card"
        />
        <OverviewCard
          title="Pending Sends"
          value={pendingBlasts}
          description="WhatsApp blasts queued"
          icon={Send}
          className="bg-gradient-to-br from-soft-pink to-card"
        />
        <OverviewCard
          title="Inventory Value"
          value={`₹${inventoryValue.toLocaleString()}`}
          description="Total stock worth"
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
          className="bg-gradient-to-br from-soft-beige to-card"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-border last:border-b-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'blast_sent' ? 'bg-soft-blue' :
                    activity.type === 'customer_added' ? 'bg-soft-green' :
                    'bg-soft-pink'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              WhatsApp Campaign Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Open Rate</span>
                <span className="text-2xl font-bold text-success">{avgOpenRate.toFixed(1)}%</span>
              </div>
              
              <div className="space-y-3">
                {mockBlasts.filter(b => b.status === "sent").map((blast) => (
                  <div key={blast.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">Campaign {blast.id}</span>
                      <span className="text-muted-foreground">{blast.openRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-soft-blue to-soft-green h-2 rounded-full transition-all duration-500"
                        style={{ width: `${blast.openRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-success">
                      {mockBlasts.filter(b => b.status === "sent").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Campaigns Sent</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning">
                      {mockBlasts.filter(b => b.status === "pending").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;