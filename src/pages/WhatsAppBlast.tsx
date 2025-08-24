import { useState } from "react";
import { Send, Users, Package, MessageSquare, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { mockCustomers, mockProducts, mockBlasts, type Customer, type Product } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const WhatsAppBlast = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const groups = ["all", ...Array.from(new Set(mockCustomers.map(c => c.group)))];
  const filteredCustomers = selectedGroup === "all" 
    ? mockCustomers 
    : mockCustomers.filter(c => c.group === selectedGroup);

  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSendBlast = () => {
    if (selectedCustomers.length === 0 || selectedProducts.length === 0 || !message.trim()) {
      toast({
        title: "Incomplete Selection",
        description: "Please select customers, products, and write a message",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "WhatsApp Blast Sent!",
      description: `Message sent to ${selectedCustomers.length} customers with ${selectedProducts.length} products`,
    });

    // Reset form
    setSelectedCustomers([]);
    setSelectedProducts([]);
    setMessage("");
  };

  const generatePreview = () => {
    const products = mockProducts.filter(p => selectedProducts.includes(p.id));
    let preview = message + "\n\n";
    
    if (products.length > 0) {
      preview += "🛍️ Featured Products:\n";
      products.forEach(product => {
        preview += `• ${product.name} - ₹${product.price}\n`;
      });
      preview += "\n📞 Contact us for bulk orders!";
    }
    
    return preview;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">WhatsApp Blast</h2>
          <p className="text-muted-foreground">Send product updates to your customers</p>
        </div>
        <Button onClick={handleSendBlast} disabled={selectedCustomers.length === 0 || selectedProducts.length === 0}>
          <Send className="h-4 w-4 mr-2" />
          Send Blast
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selection Panel */}
        <div className="space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Select Customers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group} value={group}>
                      {group === "all" ? "All Groups" : group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg">
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={() => handleCustomerToggle(customer.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.location}</div>
                    </div>
                    <Badge variant={
                      customer.group === "Premium" ? "default" :
                      customer.group === "Rural" ? "secondary" : 
                      "outline"
                    }>
                      {customer.group}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                {selectedCustomers.length} of {filteredCustomers.length} customers selected
              </div>
            </CardContent>
          </Card>

          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Select Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleProductToggle(product.id)}
                    />
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">₹{product.price}</div>
                    </div>
                    <Badge variant={product.in_stock ? "default" : "destructive"}>
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                {selectedProducts.length} of {mockProducts.length} products selected
              </div>
            </CardContent>
          </Card>

          {/* Message Composition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="text-sm text-muted-foreground mt-2">
                {message.length}/500 characters
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & History Panel */}
        <div className="space-y-6">
          {/* Message Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Message Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-soft-green p-4 rounded-lg min-h-32">
                <div className="bg-card p-3 rounded-lg shadow-sm">
                  <div className="text-sm whitespace-pre-wrap">
                    {generatePreview() || "Your message preview will appear here..."}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Preview of how your message will appear on WhatsApp
              </div>
            </CardContent>
          </Card>

          {/* Recent Blasts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Blasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockBlasts.map((blast) => (
                  <div key={blast.id} className="border border-border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium">
                        To {blast.customerIds.length} customers
                      </div>
                      <Badge variant={
                        blast.status === "sent" ? "default" :
                        blast.status === "pending" ? "secondary" :
                        "destructive"
                      }>
                        {blast.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {blast.message.slice(0, 60)}...
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{new Date(blast.sentAt).toLocaleDateString()}</span>
                      {blast.status === "sent" && (
                        <span className="text-success">{blast.openRate}% opened</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBlast;