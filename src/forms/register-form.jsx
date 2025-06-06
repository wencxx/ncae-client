import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useAuth } from "@/auth/auth-context";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";

export function RegisterForm({ className, ...props }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [firstName, setFirstname] = useState("");
  const [middleName, setMiddlename] = useState("");
  const [lastName, setLastname] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [guardian, setGuardian] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}auth/register`,
        {
          firstName,
          middleName,
          lastName,
          gender,
          birthdate,
          contact,
          email,
          guardian,
          guardianContact,
          address,
          username,
          password,
          grade,
          section,
          prefferedStrand: [],
        },
        {
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        toast.success('Registered Successfully', {
          position: 'top-center'
        })
        navigate("/login");
      } else if (res.status === 401) {
        toast.error("Invalid password", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error", {
        description: "Please try again later.",
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <a href="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex h-20 aspect-square items-center justify-center rounded-md">
            <img src="/logo.png" alt="school logo" />
          </div>
          <span className="sr-only">Acme Inc.</span>
        </a>
        <h1 className="text-xl font-bold">Welcome to DMCFI.</h1>
      </div>
      <Card className="overflow-hidden p-0">
        <CardContent>
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            <div className="gap-6  grid md:grid-cols-3">
              <div className="flex flex-col items-center text-center col-span-3">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-muted-foreground text-balance">
                  Create an account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="firstname">Firstname</Label>
                <Input
                  id="firstname"
                  type="text"
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="middlename">Middlename</Label>
                <Input
                  id="middlename"
                  type="text"
                  onChange={(e) => setMiddlename(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lastname">Lastname</Label>
                <Input
                  id="lastname"
                  type="text"
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={setGender} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gender</SelectLabel>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  type="number"
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  type="text"
                  onChange={(e) => setGrade(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  type="text"
                  onChange={(e) => setSection(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="guardian">Guardian</Label>
                <Input
                  id="guardian"
                  type="text"
                  onChange={(e) => setGuardian(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="guardian-contact">Guardian Contact</Label>
                <Input
                  id="guardian-contact"
                  type="number"
                  onChange={(e) => setGuardianContact(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="address">Permanent Address</Label>
                <Input
                  id="address"
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className={`w-full md:col-span-3 ${loading && "animate-pulse"}`}
                disabled={loading}
              >
                {loading ? "Registering" : "Register"}
              </Button>
              <div className="text-center text-sm md:col-span-3">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
