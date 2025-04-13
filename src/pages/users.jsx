import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Users() {
  const [users, setUsers] = useState([]);

  const getusers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}auth/get-all-users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        setUsers(res.data);
      }
    } catch (error) {
      toast.error("Server error", {
        description: "Please try again later",
      });
    }
  };

  useEffect(() => {
    getusers();
  }, []);

  return (
    <>
      <div className="xmb-4">
        <h1 className="text-xl font-semibold">User Lists</h1>
      </div>
      <Table>
        <TableCaption>list of users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length ? (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Pencil
                      color="green"
                      size={18}
                      className="cursor-pointer"
                    />
                    <Trash color="red" size={18} className="cursor-pointer" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="font-medium text-center !py-5" colSpan={5}>
                No user to show
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default Users;
