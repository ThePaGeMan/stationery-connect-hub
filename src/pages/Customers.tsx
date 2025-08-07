import { useState } from "react";
import { Plus, Phone, MapPin, Filter, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { mockCustomers, type Customer } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const { toast } = useToast();

  const groups = ["all", ...Array.from(new Set(mockCustomers.map(c => c.group)))];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === "all" || customer.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const handleSelectCustomer = (customerId: string, selected: boolean) => {
    if (selected) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleBulkWhatsApp = () => {
    if (selectedCustomers.length === 0) {
      toast({
        title: "No customers selected",
        description: "Please select customers to send WhatsApp blast",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "WhatsApp Blast",
      description: `Preparing to send message to ${selectedCustomers.length} customers`,
    });
  };

  const columns: ColumnDef<Customer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Customer Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            {row.original.location}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => (
        <div className="font-medium">₹{row.original.budget.toLocaleString()}</div>
      ),
    },
    {
      accessorKey: "group",
      header: "Group",
      cell: ({ row }) => (
        <Badge variant={
          row.original.group === "Premium" ? "default" :
          row.original.group === "Rural" ? "secondary" : 
          "outline"
        }>
          {row.original.group}
        </Badge>
      ),
    },
    {
      accessorKey: "interests",
      header: "Interests",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.interests.slice(0, 2).map((interest) => (
            <Badge key={interest} variant="outline" className="text-xs">
              {interest}
            </Badge>
          ))}
          {row.original.interests.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{row.original.interests.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "whatsappNumber",
      header: "WhatsApp",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Phone className="h-3 w-3 mr-2 text-success" />
          <span className="text-sm">{row.original.whatsappNumber}</span>
        </div>
      ),
    },
    {
      accessorKey: "lastContact",
      header: "Last Contact",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.lastContact).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Customers</h2>
          <p className="text-muted-foreground">Manage your retailer relationships</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {selectedCustomers.length > 0 && (
            <Button variant="outline" onClick={handleBulkWhatsApp}>
              <Phone className="h-4 w-4 mr-2" />
              Send to {selectedCustomers.length}
            </Button>
          )}
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{filteredCustomers.length}</div>
            <div className="text-sm text-muted-foreground">Total Customers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {filteredCustomers.filter(c => c.group === "Premium").length}
            </div>
            <div className="text-sm text-muted-foreground">Premium</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">
              {filteredCustomers.filter(c => c.group === "Rural").length}
            </div>
            <div className="text-sm text-muted-foreground">Rural</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-soft-blue">
              ₹{filteredCustomers.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Budget</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-full sm:w-48">
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
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      {filteredCustomers.length > 0 ? (
        <Card>
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={filteredCustomers}
              searchKey="name"
              searchPlaceholder="Search customers..."
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No customers found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Customers;