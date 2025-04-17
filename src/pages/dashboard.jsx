import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, FileText, User } from "lucide-react";
import { useAuth } from "@/auth/auth-context";
import PreferredStrand from "@/components/dashboard/preferred-strand";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function StudentProfile() {
  const { userData } = useAuth();
  const [openPreffered, setOpenPreffered] = useState(false);

  useEffect(() => {
    if (userData && !userData?.prefferedStrand.length) {
      setOpenPreffered(true);
    } else {
      setOpenPreffered(false);
    }
  }, [userData, openPreffered]);

  // get preferred strand
  const [items, setItems] = useState([]);

  const getStrand = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}strands/get`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        setItems(res.data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStrand();
  }, []);

  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold mb-6">Student Profile</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Student Information Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src="/placeholder.svg?height=64&width=64"
                alt="Student"
              />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>
                {[userData?.firstName, userData?.middleName, userData?.lastName]
                  .filter(Boolean)
                  .join(" ")}
              </CardTitle>
              <CardDescription>{userData?.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Gender
                  </h3>
                  <p>{userData?.gender || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Birthdate
                  </h3>
                  <p>{userData?.birthdate || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Contact Number
                  </h3>
                  <p>{userData?.contact || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Address
                  </h3>
                  <p>{userData?.address || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Guardian
                  </h3>
                  <p>{userData?.guardian || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Guardian Contact
                  </h3>
                  <p>{userData?.guardianContact || "N/A"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferred Strands Card */}
        <Card>
          <CardHeader>
            <CardTitle>Preferred Strands</CardTitle>
            <CardDescription>Your top 3 strand choices</CardDescription>
          </CardHeader>
          <CardContent>
            {userData && userData.prefferedStrand?.length ? (
              <div className="space-y-4">
                {userData.prefferedStrand.map((strand, index) => (
                  <div className="flex items-center gap-3" key={index}>
                    <Badge
                      className={`${
                        index === 0
                          ? "bg-green-500"
                          : index === 1
                          ? "bg-blue-500"
                          : "bg-purple-500"
                      }`}
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <h3 className="font-medium">{strand?.strandAbbr}</h3>
                      <p className="text-sm text-muted-foreground">
                        {strand?.strandName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              "No preffered strands"
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Examinations</CardTitle>
            <CardDescription>
              Take strand assessment and other exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Ready to take your strand assessment or other scheduled
              examinations? Click the button below to proceed.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/examinations-list" className="w-full">
              <Button className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                Take Examination
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              View your examination results and assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Check your examination results, strand assessment scores, and
              academic performance.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/results" className="w-full">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View Results
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <PreferredStrand
        openPreffered={openPreffered}
        setOpenPreffered={setOpenPreffered}
        items={items}
      />
    </div>
  );
}
