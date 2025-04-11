
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, Phone, Video, MessageSquare, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviewCount: number;
  experience: number;
  image: string;
  availableSlots?: string[];
  about?: string;
}

const Doctors = () => {
  const { currentUser } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>("all");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsRef = collection(db, "doctors");
        const doctorsSnapshot = await getDocs(doctorsRef);
        const doctorsData = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Sample data for demo if the database is empty
  useEffect(() => {
    if (!loading && doctors.length === 0) {
      setDoctors([
        {
          id: "1",
          name: "Dr. Sarah Johnson",
          specialty: "Cardiologist",
          hospital: "Heart & Vascular Institute",
          rating: 4.8,
          reviewCount: 124,
          experience: 12,
          image: "https://randomuser.me/api/portraits/women/44.jpg",
          availableSlots: ["2025-04-18 10:00 AM", "2025-04-20 2:30 PM", "2025-04-22 9:15 AM"],
          about: "Dr. Johnson is a board-certified cardiologist with over 12 years of experience in treating complex cardiovascular conditions. She specializes in preventive cardiology and heart disease management."
        },
        {
          id: "2",
          name: "Dr. Michael Chen",
          specialty: "Endocrinologist",
          hospital: "Metro Medical Center",
          rating: 4.9,
          reviewCount: 89,
          experience: 15,
          image: "https://randomuser.me/api/portraits/men/35.jpg",
          availableSlots: ["2025-04-19 11:30 AM", "2025-04-21 3:00 PM", "2025-04-23 10:45 AM"],
          about: "Dr. Chen is an endocrinologist with expertise in diabetes management, thyroid disorders, and hormonal imbalances. He takes a holistic approach to treatment, focusing on lifestyle modifications alongside medication management."
        },
        {
          id: "3",
          name: "Dr. David Wilson",
          specialty: "Family Medicine",
          hospital: "Community Health Partners",
          rating: 4.7,
          reviewCount: 156,
          experience: 8,
          image: "https://randomuser.me/api/portraits/men/67.jpg",
          availableSlots: ["2025-04-18 9:00 AM", "2025-04-19 1:00 PM", "2025-04-20 4:15 PM"],
          about: "Dr. Wilson is a compassionate family physician who believes in building long-term relationships with his patients. He provides comprehensive care for patients of all ages, from pediatrics to geriatrics."
        },
        {
          id: "4",
          name: "Dr. Emily Rodriguez",
          specialty: "Neurologist",
          hospital: "Neuroscience Institute",
          rating: 4.9,
          reviewCount: 78,
          experience: 10,
          image: "https://randomuser.me/api/portraits/women/28.jpg",
          availableSlots: ["2025-04-22 1:30 PM", "2025-04-23 10:00 AM", "2025-04-25 3:45 PM"],
          about: "Dr. Rodriguez specializes in treating neurological disorders including migraines, epilepsy, and movement disorders. She integrates the latest research and technology into her practice to provide optimal patient care."
        },
        {
          id: "5",
          name: "Dr. Robert Kim",
          specialty: "Dermatologist",
          hospital: "Skin & Wellness Center",
          rating: 4.6,
          reviewCount: 112,
          experience: 14,
          image: "https://randomuser.me/api/portraits/men/42.jpg",
          availableSlots: ["2025-04-19 2:00 PM", "2025-04-21 11:30 AM", "2025-04-24 9:45 AM"],
          about: "Dr. Kim is a board-certified dermatologist with expertise in both medical and cosmetic dermatology. He treats conditions ranging from acne and eczema to skin cancer, and is known for his attention to detail and patient education."
        },
        {
          id: "6",
          name: "Dr. Lisa Patel",
          specialty: "Psychiatrist",
          hospital: "Behavioral Health Services",
          rating: 4.8,
          reviewCount: 95,
          experience: 11,
          image: "https://randomuser.me/api/portraits/women/63.jpg",
          availableSlots: ["2025-04-18 3:30 PM", "2025-04-20 12:00 PM", "2025-04-22 2:15 PM"],
          about: "Dr. Patel is a psychiatrist who specializes in mood disorders, anxiety, and PTSD. She takes a personalized approach to mental health treatment, combining medication management with therapeutic interventions."
        }
      ]);
    }
  }, [loading, doctors.length]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentFilter === "all") return matchesSearch;
    return matchesSearch && doctor.specialty.toLowerCase() === currentFilter.toLowerCase();
  });

  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find a Doctor</h1>
        <p className="text-muted-foreground">
          Browse specialists and primary care physicians
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex w-full max-w-md items-center space-x-2">
          <Input
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            type="search"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setCurrentFilter}>
        <TabsList className="mb-4 flex w-full flex-wrap h-auto">
          <TabsTrigger value="all">All Specialists</TabsTrigger>
          {specialties.map((specialty) => (
            <TabsTrigger key={specialty} value={specialty.toLowerCase()}>
              {specialty}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={doctor.image || "https://via.placeholder.com/300"}
                      alt={doctor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{doctor.name}</h3>
                      <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
                    </div>
                    <Badge variant="outline" className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {doctor.rating}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{doctor.hospital}</p>
                  <p className="text-sm">{doctor.experience} years experience</p>
                </CardContent>
                <CardFooter className="flex justify-between p-6 pt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    View Profile
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Book Appointment</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Book an appointment with {doctor.name}</DialogTitle>
                        <DialogDescription>
                          Choose a date and time that works for you
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Available time slots:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {doctor.availableSlots?.map((slot, index) => (
                              <Button key={index} variant="outline" className="justify-start">
                                <Calendar className="mr-2 h-4 w-4" />
                                {slot}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Appointment type:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" className="justify-start">
                              <Video className="mr-2 h-4 w-4" />
                              Virtual
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <Phone className="mr-2 h-4 w-4" />
                              Phone
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <Calendar className="mr-2 h-4 w-4" />
                              In-person
                            </Button>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Confirm Booking</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {specialties.map((specialty) => (
          <TabsContent key={specialty} value={specialty.toLowerCase()} className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src={doctor.image || "https://via.placeholder.com/300"}
                        alt={doctor.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
                      </div>
                      <Badge variant="outline" className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {doctor.rating}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{doctor.hospital}</p>
                    <p className="text-sm">{doctor.experience} years experience</p>
                  </CardContent>
                  <CardFooter className="flex justify-between p-6 pt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      View Profile
                    </Button>
                    <Button size="sm">Book Appointment</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedDoctor && (
        <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedDoctor.name}</DialogTitle>
              <DialogDescription>{selectedDoctor.specialty} at {selectedDoctor.hospital}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedDoctor.image || "https://via.placeholder.com/150"}
                  alt={selectedDoctor.name}
                  className="h-24 w-24 rounded-md object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {selectedDoctor.rating} ({selectedDoctor.reviewCount} reviews)
                    </Badge>
                    <Badge variant="outline">{selectedDoctor.experience} years experience</Badge>
                  </div>
                  <p className="text-sm">{selectedDoctor.about}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Available for:</h4>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="flex items-center">
                    <Video className="mr-1 h-3 w-3" />
                    Virtual visits
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    In-person visits
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <MessageSquare className="mr-1 h-3 w-3" />
                    Messaging
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Next available:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {selectedDoctor.availableSlots?.slice(0, 3).map((slot, index) => (
                    <Button key={index} variant="outline" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedDoctor(null)}>Close</Button>
              <Button>Book Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Doctors;
