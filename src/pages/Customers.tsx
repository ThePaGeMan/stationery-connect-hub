import { useState } from "react";
import { Plus, Phone, MapPin, Filter, Search, Users, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/ui/data-table";
import CustomerForm from "@/components/Forms/CustomerForm";
import {type Customer} from '@/types/auth.ts'
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import {supabase} from "@/lib/supabase_client.ts";
import {useAuth} from "@/contexts/auth-context.tsx";
import {useApp} from "@/contexts/app-provider.tsx";
import {DeleteAlert} from "@/components/delete-alert/delete-alert.tsx";

const Customers = () => {
  const { user } = useAuth();
  const { customerDetails, loading, fetchCustomers} = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const { toast } = useToast();

  const groups = ["all", ...Array.from(new Set(customerDetails.map(c => c.group)))];

  const filteredCustomers = customerDetails.filter(customer => {
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

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setDeletingCustomer(customer);
  };

  const confirmDelete = async () => {
    if(!selectedCustomers) return;
    setLocalLoading(true);
    try{
      if (deletingCustomer) {
        await supabase.from("customers").delete().eq("id", deletingCustomer.id);
        await fetchCustomers();
        toast({
          title: "Customer Deleted",
          description: `${deletingCustomer.name} has been removed from your customers`,
          variant: "destructive",
        });
        setDeletingCustomer(null);
      }
    } catch (error){
      toast({
        title: 'Error in Deleting Customer',
        description: error.message,
        variant: "destructive",
      })
    }finally {
      setLocalLoading(false);
    }
  };

  const handleFormSubmit = async (customerData: Partial<Customer>) => {
      setLocalLoading(true);
    try{
      if (editingCustomer) {
        // Update existing customer
        const { error } = await supabase
            .from('customers')
            .update({
              name: customerData.name,
              location: customerData.location,
              budget: customerData.budget,
              interests: customerData.interests,
              whatsapp_number: customerData.whatsapp_number,
              group: customerData.group,
              last_contact: customerData.last_contact,
            })
            .eq('id', editingCustomer.id)
            .eq('created_by', editingCustomer.created_by)

        if(error) throw error;

        await fetchCustomers();
        toast({
          title: "Customer Updated",
          description: `${customerData.name} has been updated successfully`,
        });
      } else {
        // Add new customer
        const { error } = await supabase
            .from("customers")
            .insert([
              {
                name: customerData.name,
                location: customerData.location,
                budget: customerData.budget,
                interests: customerData.interests,
                whatsapp_number: customerData.whatsapp_number,
                group: customerData.group,
                last_contact: customerData.last_contact,
                created_by: user?.id, // attach logged-in user
              },
            ])
            .select()
            .single();

        if(error) throw error;

        await fetchCustomers();

        toast({
          title: "Customer Added",
          description: `${customerData.name} has been added to your customers`,
        });
      }
      setIsFormOpen(false);
      setEditingCustomer(null);
    } catch (err: any){
      console.error('Error saving customer', err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLocalLoading(false);
    }

  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
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
      accessorKey: "whatsapp_number",
      header: "WhatsApp",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Phone className="h-3 w-3 mr-2 text-success" />
          <span className="text-sm">{row.original.whatsapp_number}</span>
        </div>
      ),
    },
    {
      accessorKey: "last_contact",
      header: "Last Contact",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.last_contact).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditCustomer(row.original)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteCustomer(row.original)}
          >
            <Trash className="h-3 w-3" />
          </Button>
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
          <Button onClick={handleAddCustomer} className="w-full sm:w-auto">
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
      {filteredCustomers.length > 0 || loading ? (
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

      {/* Customer Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <CustomerForm
            customer={editingCustomer || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={localLoading}
          />
        </DialogContent>
      </Dialog>

      <DeleteAlert
          open={!!deletingCustomer}
          title="Delete Customer"
          description={`Are you sure you want to delete "${deletingCustomer?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onClose={() => setDeletingCustomer(null)}
      />

    </div>
  );
};

export default Customers;