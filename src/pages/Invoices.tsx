import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  DollarSign,
  Calendar,
  Send,
  Eye,
  Edit as EditIcon,
  Download,
  Filter,
  Search,
  MoreHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { setInvoices, updateInvoice } from "@/store/slices/supportSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ViewInvoice from "@/components/invoices/ViewInvoice";
import EditInvoice from "@/components/invoices/EditInvoice";

// Import Invoice type from supportSlice
import type { Invoice } from "@/store/slices/supportSlice";





interface InvoiceCardProps {
  invoice: Invoice;
  onUpdate: (invoice: Invoice) => void;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onUpdate,
  onView,
  onEdit,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleStatusChange = (newStatus: Invoice["status"]) => {
    onUpdate({
      ...invoice,
      status: newStatus,
      ...(newStatus === "paid" && { paidAt: new Date().toISOString() }),
    });
  };

  const getDaysUntilDue = () => {
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="glass-card-hover overflow-hidden relative">
        <div
          className={`absolute top-0 left-0 w-full h-1 ${
            invoice.status === "paid"
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : invoice.status === "overdue"
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : "bg-gradient-to-r from-blue-500 to-blue-600"
          }`}
        />

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${invoice.userEmail}`}
                />
                <AvatarFallback>
                  {invoice.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">
                  Invoice #{invoice.id}
                </h3>
                <p className="text-foreground font-medium">
                  {invoice.userName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.userEmail}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status.charAt(0).toUpperCase() +
                      invoice.status.slice(1)}
                  </Badge>
                  {invoice.status === "sent" && daysUntilDue < 0 && (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      {Math.abs(daysUntilDue)} days overdue
                    </Badge>
                  )}
                  {invoice.status === "sent" && daysUntilDue > 0 && (
                    <Badge variant="outline">Due in {daysUntilDue} days</Badge>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card">
                <DropdownMenuItem onClick={() => onView(invoice)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(invoice)}>
                  <EditIcon className="w-4 h-4 mr-2" />
                  Edit Invoice
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
                {invoice.status === "draft" && (
                  <DropdownMenuItem onClick={() => handleStatusChange("sent")}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Invoice
                  </DropdownMenuItem>
                )}
                {invoice.status === "sent" && (
                  <DropdownMenuItem onClick={() => handleStatusChange("paid")}>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Mark as Paid
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-2xl font-bold text-primary">
                ${invoice.amount.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2 text-foreground">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Due Date:</span>
                <span className="ml-2 text-foreground">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {invoice.paidAt && (
              <div className="text-sm">
                <span className="text-muted-foreground">Paid on:</span>
                <span className="ml-2 text-success font-medium">
                  {new Date(invoice.paidAt).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="border-t pt-3">
              <h4 className="font-medium text-foreground mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">
                {invoice.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Invoices = () => {
  const dispatch = useAppDispatch();
  const { invoices, loading } = useAppSelector((state) => state.support);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [form, setForm] = useState<Partial<Invoice>>({
    id: "",
    userName: "",
    userEmail: "",
    amount: 0,
    description: "",
    status: "draft",
    dueDate: "",
    userId: "",
  });

  useEffect(() => {
    // Simulate loading invoices data
    setTimeout(() => {
      const mockInvoices: Invoice[] = [
        {
          id: "INV-001",
          userId: "1",
          userName: "Sarah Wilson",
          userEmail: "sarah@restaurant.com",
          amount: 2500,
          description:
            "Recipe website development and 3 months premium support",
          status: "paid",
          dueDate: "2024-01-15T00:00:00Z",
          createdAt: "2023-12-15T10:30:00Z",
          paidAt: "2024-01-10T14:20:00Z",
        },
        {
          id: "INV-002",
          userId: "2",
          userName: "Mike Johnson",
          userEmail: "mike@bistro.com",
          amount: 1800,
          description:
            "Custom recipe sharing platform with inventory management",
          status: "sent",
          dueDate: "2024-02-01T00:00:00Z",
          createdAt: "2024-01-15T09:15:00Z",
        },
        {
          id: "INV-003",
          userId: "3",
          userName: "Emily Davis",
          userEmail: "emily@foodblog.com",
          amount: 950,
          description:
            "Monthly premium plan and additional design customizations",
          status: "overdue",
          dueDate: "2024-01-10T00:00:00Z",
          createdAt: "2023-12-20T11:45:00Z",
        },
        {
          id: "INV-004",
          userId: "4",
          userName: "Restaurant Chain LLC",
          userEmail: "contact@restaurantchain.com",
          amount: 5000,
          description: "Enterprise recipe management system - Phase 1",
          status: "draft",
          dueDate: "2024-02-15T00:00:00Z",
          createdAt: "2024-01-20T16:30:00Z",
        },
      ];

      dispatch(setInvoices(mockInvoices));
    }, 1000);
  }, [dispatch]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleInvoiceUpdate = (updatedInvoice: Invoice) => {
    dispatch(updateInvoice(updatedInvoice));
  };

  const saveInvoice = () => {
    if (!form.id || !form.userName || !form.userEmail) return;
    
    const invoiceToSave: Invoice = {
      id: form.id,
      userId: form.userId || '1', // Default user ID
      userName: form.userName,
      userEmail: form.userEmail,
      amount: form.amount || 0,
      description: form.description || '',
      status: form.status as Invoice['status'] || 'draft',
      dueDate: form.dueDate || new Date().toISOString(),
      createdAt: form.createdAt || new Date().toISOString(),
      paidAt: form.paidAt,
    };

    dispatch(updateInvoice(invoiceToSave));
    setModalOpen(false);
    
    // Reset form
    setForm({
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      userName: '',
      userEmail: '',
      amount: 0,
      description: '',
      status: 'draft',
      dueDate: new Date().toISOString(),
      userId: '',
    });
  };

  const openCreate = () => {
    setEditingInvoice(null);
    setForm({
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      userName: "",
      userEmail: "",
      amount: 0,
      description: "",
      status: "draft",
      dueDate: new Date().toISOString(),
      userId: "",
      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
    });
    setModalOpen(true);
  };

  const openEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
  };

  const handleSaveInvoice = (updatedInvoice: Invoice) => {
    dispatch(updateInvoice(updatedInvoice));
    setEditingInvoice(null);
  };

  const exportCSV = () => {
    const rows = filteredInvoices.map((inv) => ({
      id: inv.id,
      userName: inv.userName,
      userEmail: inv.userEmail,
      amount: inv.amount,
      status: inv.status,
      createdAt: inv.createdAt,
      dueDate: inv.dueDate,
      paidAt: inv.paidAt || "",
    }));
    const headers = Object.keys(
      rows[0] || {
        id: "",
        userName: "",
        userEmail: "",
        amount: "",
        status: "",
        createdAt: "",
        dueDate: "",
        paidAt: "",
      }
    );
    const escape = (v: string | number | undefined) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const csv = [headers.join(",")]
      .concat(
        rows.map((r: Record<string, string | number | undefined>) =>
          headers.map((h) => escape(r[h])).join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter((inv) => inv.status === "paid").length,
    paidAmount: invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.amount, 0),
    pending: invoices.filter((inv) => inv.status === "sent").length,
    overdue: invoices.filter((inv) => inv.status === "overdue").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <FileText className="w-8 h-8 text-primary" />
            <span>Invoices</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage invoices for your recipe sharing services
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="glass-card" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button
            className="bg-gold-gradient text-primary-foreground shadow-gold"
            onClick={openCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Invoices",
            value: stats.total,
            icon: FileText,
            color: "from-blue-500 to-blue-600",
            description: `$${stats.totalAmount.toLocaleString()} total`,
          },
          {
            label: "Paid",
            value: stats.paid,
            icon: DollarSign,
            color: "from-green-500 to-green-600",
            description: `$${stats.paidAmount.toLocaleString()} received`,
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Calendar,
            color: "from-yellow-500 to-yellow-600",
            description: "Awaiting payment",
          },
          {
            label: "Overdue",
            value: stats.overdue,
            icon: FileText,
            color: "from-red-500 to-red-600",
            description: "Requires attention",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="glass-card-hover overflow-hidden relative">
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`}
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}
                  >
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search invoices by client name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-card"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 glass-card">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="all">All Invoices</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInvoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <InvoiceCard
              invoice={invoice}
              onUpdate={handleInvoiceUpdate}
              onView={(inv) => setViewingInvoice(inv)}
              onEdit={openEdit}
            />
          </motion.div>
        ))}

      {filteredInvoices.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No invoices found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first invoice to get started"}
          </p>
        </motion.div>
      )}

      {/* Edit Invoice Modal */}
      <EditInvoice
        invoice={editingInvoice}
        isOpen={!!editingInvoice}
        onSave={handleSaveInvoice}
        onClose={() => setEditingInvoice(null)}
      />

      {/* Create Invoice Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl glass-card">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>Fill in the details and save</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inv-id">ID</Label>
              <Input
                id="inv-id"
                value={form.id as string}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, id: e.target.value }))
                }
                className="glass-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-amount">Amount</Label>
              <Input
                id="inv-amount"
                type="number"
                value={String(form.amount ?? 0)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    amount: Number(e.target.value),
                  }))
                }
                className="glass-card"
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="inv-name">Client Name</Label>
              <Input
                id="inv-name"
                value={form.userName as string}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, userName: e.target.value }))
                }
                className="glass-card"
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="inv-email">Client Email</Label>
              <Input
                id="inv-email"
                type="email"
                value={form.userEmail as string}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, userEmail: e.target.value }))
                }
                className="glass-card"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="inv-desc">Description</Label>
              <Input
                id="inv-desc"
                value={form.description as string}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="glass-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-due">Due Date</Label>
              <Input
                id="inv-due"
                type="date"
                value={(form.dueDate || "").slice(0, 10)}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="glass-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-status">Status</Label>
              <Select
                value={form.status as string}
                onValueChange={(v) =>
                  setForm((prev) => ({
                    ...prev,
                    status: v as Invoice["status"],
                  }))
                }
              >
                <SelectTrigger id="inv-status" className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gold-gradient text-primary-foreground"
              onClick={saveInvoice}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Invoice Modal */}
      <ViewInvoice
        invoice={viewingInvoice}
        isOpen={!!viewingInvoice}
        onClose={() => setViewingInvoice(null)}
      />
    </div>
    </div>
  );
};

export default Invoices;
