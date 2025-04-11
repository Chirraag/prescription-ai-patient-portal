
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Pill, User } from "lucide-react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  refillDate?: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        // Fetch medications
        const medsRef = collection(db, "medications");
        const medsQuery = query(medsRef, where("patientId", "==", currentUser.uid), limit(3));
        const medsSnapshot = await getDocs(medsQuery);
        const medsData = medsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medication));
        setMedications(medsData);

        // Fetch appointments
        const apptsRef = collection(db, "appointments");
        const apptsQuery = query(apptsRef, where("patientId", "==", currentUser.uid), limit(3));
        const apptsSnapshot = await getDocs(apptsQuery);
        const apptsData = apptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
        setAppointments(apptsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Sample data for demo if the database is empty
  useEffect(() => {
    if (!loading && medications.length === 0) {
      setMedications([
        {
          id: "1",
          name: "Lisinopril",
          dosage: "10mg",
          instructions: "Take once daily with food",
          refillDate: "2025-05-15"
        },
        {
          id: "2",
          name: "Metformin",
          dosage: "500mg",
          instructions: "Take twice daily with meals",
          refillDate: "2025-05-01"
        },
        {
          id: "3",
          name: "Atorvastatin",
          dosage: "20mg",
          instructions: "Take once daily in the evening",
          refillDate: "2025-05-20"
        }
      ]);
    }

    if (!loading && appointments.length === 0) {
      setAppointments([
        {
          id: "1",
          doctorName: "Dr. Sarah Johnson",
          doctorSpecialty: "Cardiologist",
          date: "2025-04-18",
          time: "10:00 AM",
          status: "upcoming"
        },
        {
          id: "2",
          doctorName: "Dr. Michael Chen",
          doctorSpecialty: "Endocrinologist",
          date: "2025-04-25",
          time: "2:30 PM",
          status: "upcoming"
        }
      ]);
    }
  }, [loading, medications.length, appointments.length]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.displayName || "Patient"}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>Book New Appointment</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Medications
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medications.length}</div>
            <p className="text-xs text-muted-foreground">
              Active prescriptions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt => apt.status === 'upcoming').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Next: {appointments.length > 0 ? formatDate(appointments[0].date) : "None scheduled"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Refills Due
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Within next 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Doctors
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Connected healthcare providers
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="medications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="medications" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {medications.map((medication) => (
              <Card key={medication.id}>
                <CardHeader>
                  <CardTitle>{medication.name}</CardTitle>
                  <CardDescription>{medication.dosage}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    {medication.instructions}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      Refill by: <span className="font-medium">{formatDate(medication.refillDate || "")}</span>
                    </div>
                    <Button variant="outline" size="sm">Request Refill</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" className="w-full">View All Medications</Button>
        </TabsContent>
        <TabsContent value="appointments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{appointment.doctorName}</CardTitle>
                      <CardDescription>{appointment.doctorSpecialty}</CardDescription>
                    </div>
                    <Badge 
                      className={
                        appointment.status === 'upcoming' 
                          ? 'bg-blue-500' 
                          : appointment.status === 'completed' 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">Reschedule</Button>
                    <Button variant="default" size="sm" className="flex-1">Join Virtual</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" className="w-full">View All Appointments</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
