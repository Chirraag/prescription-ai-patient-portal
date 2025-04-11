
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, MapPin, MoreHorizontal, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage?: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'virtual' | 'in-person' | 'phone';
  location?: string;
  notes?: string;
}

const Appointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser) return;

      try {
        const apptsRef = collection(db, "appointments");
        const apptsQuery = query(apptsRef, where("patientId", "==", currentUser.uid));
        const apptsSnapshot = await getDocs(apptsQuery);
        const apptsData = apptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
        setAppointments(apptsData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser]);

  // Sample data for demo if the database is empty
  useEffect(() => {
    if (!loading && appointments.length === 0) {
      setAppointments([
        {
          id: "1",
          doctorId: "1",
          doctorName: "Dr. Sarah Johnson",
          doctorSpecialty: "Cardiologist",
          doctorImage: "https://randomuser.me/api/portraits/women/44.jpg",
          date: "2025-04-18",
          time: "10:00 AM",
          status: "upcoming",
          type: "virtual",
          notes: "Annual heart checkup and medication review"
        },
        {
          id: "2",
          doctorId: "2",
          doctorName: "Dr. Michael Chen",
          doctorSpecialty: "Endocrinologist",
          doctorImage: "https://randomuser.me/api/portraits/men/35.jpg",
          date: "2025-04-25",
          time: "2:30 PM",
          status: "upcoming",
          type: "in-person",
          location: "Metro Medical Center, Suite 305",
          notes: "Follow-up on lab results and diabetes management"
        },
        {
          id: "3",
          doctorId: "3",
          doctorName: "Dr. David Wilson",
          doctorSpecialty: "Family Medicine",
          doctorImage: "https://randomuser.me/api/portraits/men/67.jpg",
          date: "2025-03-15",
          time: "11:15 AM",
          status: "completed",
          type: "phone",
          notes: "Discussed medication side effects and adjusted dosage"
        },
        {
          id: "4",
          doctorId: "4",
          doctorName: "Dr. Emily Rodriguez",
          doctorSpecialty: "Neurologist",
          doctorImage: "https://randomuser.me/api/portraits/women/28.jpg",
          date: "2025-03-05",
          time: "3:45 PM",
          status: "completed",
          type: "in-person",
          location: "Neuroscience Institute, Room 210",
          notes: "Initial consultation for recurring migraines"
        },
        {
          id: "5",
          doctorId: "5",
          doctorName: "Dr. Robert Kim",
          doctorSpecialty: "Dermatologist",
          doctorImage: "https://randomuser.me/api/portraits/men/42.jpg",
          date: "2025-02-20",
          time: "1:00 PM",
          status: "cancelled",
          type: "virtual",
          notes: "Rescheduled due to doctor's unavailability"
        }
      ]);
    }
  }, [loading, appointments.length]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const pastAppointments = appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled');

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'in-person':
        return <MapPin className="h-4 w-4 text-green-500" />;
      case 'phone':
        return <MessageCircle className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your scheduled consultations
          </p>
        </div>
        <div>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule New Appointment
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming
            <Badge className="ml-2 bg-blue-500">{upcomingAppointments.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="past">
            Past
            <Badge className="ml-2 bg-gray-500">{pastAppointments.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">You don't have any upcoming appointments</p>
                <Link to="/doctors">
                  <Button>Find a Doctor</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="bg-muted/30 pb-3">
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingAppointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                              <img 
                                src={apt.doctorImage || "https://via.placeholder.com/40"} 
                                alt={apt.doctorName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{apt.doctorName}</div>
                              <div className="text-sm text-muted-foreground">{apt.doctorSpecialty}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(apt.date)}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{apt.time}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getAppointmentTypeIcon(apt.type)}
                            <span className="ml-2 capitalize">{apt.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {apt.type === 'in-person' ? apt.location : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={apt.notes}>
                            {apt.notes}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {apt.type === 'virtual' && (
                              <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                                <Video className="mr-2 h-4 w-4" />
                                Join
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                <DropdownMenuItem>Add to Calendar</DropdownMenuItem>
                                <DropdownMenuItem>Message Doctor</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Cancel Appointment</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-10">
                <p className="text-muted-foreground">No past appointments found</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="bg-muted/30 pb-3">
                <CardTitle className="text-lg">Past Appointments</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastAppointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                              <img 
                                src={apt.doctorImage || "https://via.placeholder.com/40"} 
                                alt={apt.doctorName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{apt.doctorName}</div>
                              <div className="text-sm text-muted-foreground">{apt.doctorSpecialty}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(apt.date)}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{apt.time}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getAppointmentTypeIcon(apt.type)}
                            <span className="ml-2 capitalize">{apt.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              apt.status === 'completed' 
                                ? 'bg-green-500' 
                                : 'bg-red-500'
                            }
                          >
                            {apt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={apt.notes}>
                            {apt.notes}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Book Again
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Summary</DropdownMenuItem>
                                <DropdownMenuItem>Message Doctor</DropdownMenuItem>
                                <DropdownMenuItem>Leave Review</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
