import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {Save, X} from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type Customer } from "@/types/auth";
import {useAuth} from "@/contexts/auth-context.tsx";

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (customer: Partial<Customer>) => void;
  onCancel: () => void;
  loading: boolean;
}

const groups: Customer["group"][] = ["Premium", "Rural", "Budget Buyers"];

const CustomerForm = ({ customer, onSubmit, onCancel , loading}: CustomerFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    location: customer?.location || "",
    budget: customer?.budget || 0,
    whatsappNumber: customer?.whatsappNumber || "",
    group: customer?.group || "Budget Buyers" as Customer["group"],
    interests: customer?.interests || [],
    lastContact: customer?.lastContact || new Date().toISOString().split('T')[0],
  });
  const [newInterest, setNewInterest] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      created_by: user?.id,
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };



  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>{customer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
        <DialogDescription>
          {customer ? "Update customer information" : "Add a new customer to your CRM"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, State"
              required
            />
          </div>
        </div>

        {/* Budget and Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (₹)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
              placeholder="Enter budget amount"
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Customer Group</Label>
            <Select value={formData.group} onValueChange={(value: Customer["group"]) => setFormData(prev => ({ ...prev, group: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(group => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
              placeholder="+91 XXXXX XXXXX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastContact">Last Contact Date</Label>
            <Input
              id="lastContact"
              type="date"
              value={formData.lastContact}
              onChange={(e) => setFormData(prev => ({ ...prev, lastContact: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <Label>Interests</Label>
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setNewInterest(e.target.value)
              }}

              placeholder="Add an interest (e.g., school, office, premium)"
              className="flex-1"
            />
            <Button type="button" onClick={addInterest} variant="outline">
              Add
            </Button>
          </div>
          {formData.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {interest}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeInterest(interest)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-2" />
            ) : (
                <Save className="h-4 w-4 mr-2" />
            )}
            {customer ? "Update Customer" : "Add Customer"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;