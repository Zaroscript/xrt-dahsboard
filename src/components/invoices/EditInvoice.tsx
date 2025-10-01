import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Invoice } from "@/store/slices/supportSlice";

interface EditInvoiceProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onSave: (invoice: Invoice) => void;
  onClose: () => void;
}

const EditInvoice = ({ invoice, isOpen, onSave, onClose }: EditInvoiceProps) => {
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [items, setItems] = useState<Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    details?: string;
  }>>([]);

  useEffect(() => {
    if (invoice) {
      setEditedInvoice(invoice);
      setDate(invoice.createdAt ? new Date(invoice.createdAt) : new Date());
      setDueDate(invoice.dueDate ? new Date(invoice.dueDate) : new Date());
      setItems(invoice.items || [{
        description: '',
        quantity: 1,
        unitPrice: 0,
        details: ''
      }]);
    }
  }, [invoice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedInvoice) return;
    
    const { name, value } = e.target;
    setEditedInvoice({
      ...editedInvoice,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value
    };
    setItems(newItems);

    // Update the subtotal
    if (field === 'quantity' || field === 'unitPrice') {
      const subtotal = newItems.reduce((sum, item) => {
        return sum + (item.quantity * item.unitPrice);
      }, 0);
      
      setEditedInvoice(prev => prev ? {
        ...prev,
        items: newItems,
        subtotal,
        amount: subtotal - (prev.discountAmount || 0) + (prev.taxAmount || 0)
      } : null);
    }
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, details: '' }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    
    if (editedInvoice) {
      const subtotal = newItems.reduce((sum, item) => {
        return sum + (item.quantity * item.unitPrice);
      }, 0);
      
      setEditedInvoice({
        ...editedInvoice,
        items: newItems,
        subtotal,
        amount: subtotal - (editedInvoice.discountAmount || 0) + (editedInvoice.taxAmount || 0)
      });
    }
  };

  const handleSave = () => {
    if (editedInvoice) {
      onSave({
        ...editedInvoice,
        items: items.filter(item => item.description.trim() !== '')
      });
    }
  };

  if (!editedInvoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Invoice #{editedInvoice.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedInvoice.status}
                onValueChange={(value) => 
                  setEditedInvoice({
                    ...editedInvoice,
                    status: value as Invoice['status']
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      if (newDate) {
                        setEditedInvoice({
                          ...editedInvoice,
                          createdAt: newDate.toISOString()
                        });
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(newDate) => {
                      setDueDate(newDate);
                      if (newDate) {
                        setEditedInvoice({
                          ...editedInvoice,
                          dueDate: newDate.toISOString()
                        });
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={editedInvoice.amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Bill To */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bill To</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="userName">Client Name</Label>
                <Input
                  id="userName"
                  name="userName"
                  value={editedInvoice.userName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  value={editedInvoice.userEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userAddress.street">Street Address</Label>
                <Input
                  id="userAddress.street"
                  name="userAddress.street"
                  value={editedInvoice.userAddress?.street || ''}
                  onChange={(e) => {
                    setEditedInvoice({
                      ...editedInvoice,
                      userAddress: {
                        ...editedInvoice.userAddress,
                        street: e.target.value
                      }
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userAddress.city">City</Label>
                <Input
                  id="userAddress.city"
                  name="userAddress.city"
                  value={editedInvoice.userAddress?.city || ''}
                  onChange={(e) => {
                    setEditedInvoice({
                      ...editedInvoice,
                      userAddress: {
                        ...editedInvoice.userAddress,
                        city: e.target.value
                      }
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userAddress.state">State/Province</Label>
                <Input
                  id="userAddress.state"
                  name="userAddress.state"
                  value={editedInvoice.userAddress?.state || ''}
                  onChange={(e) => {
                    setEditedInvoice({
                      ...editedInvoice,
                      userAddress: {
                        ...editedInvoice.userAddress,
                        state: e.target.value
                      }
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userAddress.zip">ZIP/Postal Code</Label>
                <Input
                  id="userAddress.zip"
                  name="userAddress.zip"
                  value={editedInvoice.userAddress?.zip || ''}
                  onChange={(e) => {
                    setEditedInvoice({
                      ...editedInvoice,
                      userAddress: {
                        ...editedInvoice.userAddress,
                        zip: e.target.value
                      }
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Items</h3>
              <Button type="button" size="sm" onClick={addItem}>
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-5 space-y-1">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label>Total</Label>
                    <div className="p-2 border rounded-md bg-muted/50">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="text-destructive"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={editedInvoice.notes || ''}
              onChange={handleInputChange}
              placeholder="Any additional notes or terms"
              rows={3}
            />
          </div>

          {/* Totals */}
          <div className="ml-auto max-w-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${editedInvoice.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax ({editedInvoice.taxRate || 0}%):</span>
              <span>${editedInvoice.taxAmount?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount:</span>
              <span className="text-destructive">-${editedInvoice.discountAmount?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-semibold">
              <span>Total:</span>
              <span>${editedInvoice.amount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvoice;
