
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'discontinued';
  instructions: string;
  refillDate?: string;
}

const Medications = () => {
  const { currentUser } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMedications = async () => {
      if (!currentUser) return;

      try {
        const medsRef = collection(db, "medications");
        const medsQuery = query(medsRef, where("patientId", "==", currentUser.uid));
        const medsSnapshot = await getDocs(medsQuery);
        const medsData = medsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medication));
        setMedications(medsData);
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [currentUser]);

  // Sample data for demo if the database is empty
  useEffect(() => {
    if (!loading && medications.length === 0) {
      setMedications([
        {
          id: "1",
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          startDate: "2024-12-01",
          prescribedBy: "Dr. Sarah Johnson",
          status: "active",
          instructions: "Take once daily with food",
          refillDate: "2025-05-15"
        },
        {
          id: "2",
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          startDate: "2024-11-15",
          prescribedBy: "Dr. Michael Chen",
          status: "active",
          instructions: "Take twice daily with meals",
          refillDate: "2025-05-01"
        },
        {
          id: "3",
          name: "Atorvastatin",
          dosage: "20mg",
          frequency: "Once daily",
          startDate: "2024-10-10",
          prescribedBy: "Dr. Sarah Johnson",
          status: "active",
          instructions: "Take once daily in the evening",
          refillDate: "2025-05-20"
        },
        {
          id: "4",
          name: "Amoxicillin",
          dosage: "500mg",
          frequency: "Three times daily",
          startDate: "2024-02-01",
          endDate: "2024-02-10",
          prescribedBy: "Dr. David Wilson",
          status: "completed",
          instructions: "Take with food every 8 hours until completed",
        },
        {
          id: "5",
          name: "Prednisone",
          dosage: "10mg",
          frequency: "Once daily",
          startDate: "2024-01-15",
          endDate: "2024-01-30",
          prescribedBy: "Dr. Sarah Johnson",
          status: "discontinued",
          instructions: "Take in the morning with food, taper as directed",
        }
      ]);
    }
  }, [loading, medications.length]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredMedications = medications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMedications = filteredMedications.filter(med => med.status === 'active');
  const pastMedications = filteredMedications.filter(med => med.status !== 'active');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
          <p className="text-muted-foreground">
            Manage your prescriptions and medications
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        </div>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          placeholder="Search medications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
          type="search"
        />
        <Button type="submit" size="icon" variant="ghost">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-muted">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-lg flex items-center">
            Active Medications
            <Badge className="ml-2 bg-green-500">{activeMedications.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Refill Due</TableHead>
                <TableHead>Prescribed By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeMedications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No active medications found
                  </TableCell>
                </TableRow>
              ) : (
                activeMedications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>{formatDate(med.startDate)}</TableCell>
                    <TableCell>{formatDate(med.refillDate)}</TableCell>
                    <TableCell>{med.prescribedBy}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Refill
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-muted">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-lg flex items-center">
            Past Medications
            <Badge className="ml-2 bg-gray-500">{pastMedications.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Prescribed By</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastMedications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No past medications found
                  </TableCell>
                </TableRow>
              ) : (
                pastMedications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>{formatDate(med.startDate)}</TableCell>
                    <TableCell>{formatDate(med.endDate)}</TableCell>
                    <TableCell>{med.prescribedBy}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          med.status === 'completed' 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }
                      >
                        {med.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Medications;
