import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { fi } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Edit,
  LogOut,
  Mail,
  Phone,
  Trash2,
  User,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string | null;
  service_id: string | null;
  created_at: string;
  services?: { name: string; price: number } | null;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  pending: { label: "Odottaa", variant: "secondary", icon: <AlertCircle className="h-3 w-3" /> },
  confirmed: { label: "Vahvistettu", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  cancelled: { label: "Peruttu", variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
  completed: { label: "Valmis", variant: "outline", icon: <CheckCircle className="h-3 w-3" /> },
};

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    booking_date: "",
    booking_time: "",
    status: "",
    notes: "",
  });

  // Fetch bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          services (name, price)
        `)
        .order("booking_date", { ascending: false })
        .order("booking_time", { ascending: true });

      if (error) throw error;
      return data as Booking[];
    },
  });

  // Update booking mutation
  const updateMutation = useMutation({
    mutationFn: async (booking: Partial<Booking> & { id: string }) => {
      const { id, services, ...updateData } = booking;
      const { error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast({
        title: "Varaus päivitetty",
        description: "Varauksen tiedot on tallennettu.",
      });
      setIsEditDialogOpen(false);
      setEditingBooking(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Virhe",
        description: "Varauksen päivitys epäonnistui.",
      });
      console.error("Update error:", error);
    },
  });

  // Delete booking mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast({
        title: "Varaus poistettu",
        description: "Varaus on poistettu onnistuneesti.",
      });
      setIsDeleteDialogOpen(false);
      setDeletingBooking(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Virhe",
        description: "Varauksen poisto epäonnistui.",
      });
      console.error("Delete error:", error);
    },
  });

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setEditForm({
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone || "",
      booking_date: booking.booking_date,
      booking_time: booking.booking_time,
      status: booking.status,
      notes: booking.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (booking: Booking) => {
    setDeletingBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingBooking) return;
    updateMutation.mutate({
      id: editingBooking.id,
      ...editForm,
      customer_phone: editForm.customer_phone || null,
      notes: editForm.notes || null,
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingBooking) return;
    deleteMutation.mutate(deletingBooking.id);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/yllapito");
  };

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), "d.M.yyyy", { locale: fi });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  // Stats
  const todayBookings = bookings?.filter(
    (b) => b.booking_date === format(new Date(), "yyyy-MM-dd")
  ).length || 0;

  const pendingBookings = bookings?.filter((b) => b.status === "pending").length || 0;
  const confirmedBookings = bookings?.filter((b) => b.status === "confirmed").length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">
              Ylläpito
            </h1>
            <p className="text-sm text-muted-foreground">
              Varausten hallinta
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Kirjaudu ulos
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tänään</CardDescription>
              <CardTitle className="text-3xl">{todayBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">varausta</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Odottaa vahvistusta</CardDescription>
              <CardTitle className="text-3xl">{pendingBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">varausta</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Vahvistettu</CardDescription>
              <CardTitle className="text-3xl">{confirmedBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">varausta</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Varaukset</CardTitle>
            <CardDescription>
              Kaikki varaukset uusimmasta vanhimpaan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : bookings?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Ei varauksia
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Päivä</TableHead>
                      <TableHead>Aika</TableHead>
                      <TableHead>Asiakas</TableHead>
                      <TableHead>Palvelu</TableHead>
                      <TableHead>Tila</TableHead>
                      <TableHead className="text-right">Toiminnot</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings?.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(booking.booking_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatTime(booking.booking_time)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{booking.customer_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {booking.customer_email}
                            </div>
                            {booking.customer_phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {booking.customer_phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {booking.services?.name || "-"}
                          {booking.services?.price && (
                            <div className="text-sm text-muted-foreground">
                              {booking.services.price} €
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[booking.status]?.variant || "secondary"}>
                            {statusConfig[booking.status]?.icon}
                            <span className="ml-1">
                              {statusConfig[booking.status]?.label || booking.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(booking)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(booking)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Muokkaa varausta</DialogTitle>
            <DialogDescription>
              Päivitä varauksen tiedot alla.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Asiakkaan nimi</Label>
              <Input
                id="edit-name"
                value={editForm.customer_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, customer_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Sähköposti</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.customer_email}
                onChange={(e) =>
                  setEditForm({ ...editForm, customer_email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Puhelin</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editForm.customer_phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, customer_phone: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Päivämäärä</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.booking_date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, booking_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Aika</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editForm.booking_time}
                  onChange={(e) =>
                    setEditForm({ ...editForm, booking_time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Tila</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, status: value })
                }
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Odottaa</SelectItem>
                  <SelectItem value="confirmed">Vahvistettu</SelectItem>
                  <SelectItem value="cancelled">Peruttu</SelectItem>
                  <SelectItem value="completed">Valmis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Muistiinpanot</Label>
              <Textarea
                id="edit-notes"
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Peruuta
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tallennetaan...
                </>
              ) : (
                "Tallenna"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Poista varaus</DialogTitle>
            <DialogDescription>
              Haluatko varmasti poistaa tämän varauksen? Tätä toimintoa ei voi
              peruuttaa.
            </DialogDescription>
          </DialogHeader>
          {deletingBooking && (
            <div className="py-4 space-y-2 text-sm">
              <p>
                <strong>Asiakas:</strong> {deletingBooking.customer_name}
              </p>
              <p>
                <strong>Päivämäärä:</strong>{" "}
                {formatDate(deletingBooking.booking_date)} klo{" "}
                {formatTime(deletingBooking.booking_time)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Peruuta
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Poistetaan...
                </>
              ) : (
                "Poista"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
