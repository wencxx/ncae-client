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
import moment from "moment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false)

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

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const fullName = [user.firstName, user.middleName, user.lastName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const email = user.email?.toLowerCase() || "";
    const contact = user.contact?.toLowerCase() || "";
    const guardian = user.guardian?.toLowerCase() || "";
    const guardianContact = user.guardianContact?.toLowerCase() || "";
    const address = user.address?.toLowerCase() || "";
    const gender = user.gender?.toLowerCase() || "";
    return (
      fullName.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      contact.includes(search.toLowerCase()) ||
      guardian.includes(search.toLowerCase()) ||
      guardianContact.includes(search.toLowerCase()) ||
      address.includes(search.toLowerCase()) ||
      gender.includes(search.toLowerCase())
    );
  });

  // delete user
  const deleteUser = async () => {
    try {
      setDeleting(true)
      const res = await axios.delete(`${import.meta.env.VITE_ENDPOINT}auth/delete-user/${userToDelete}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        validateStatus: status => status < 500
      })

      if(res.status !== 200){
        toast.error("Failed to delete user")
      }else{
        toast.success('Deleted user successfully')
        setUsers(prev => prev.filter(user => user._id !== userToDelete))
      }
    } catch (error) {
      toast.error(error.response.data || 'Server error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="xmb-4">
        <h1 className="text-xl font-semibold">Examineers Lists</h1>
      </div>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-xs focus:outline-none focus:ring"
        />
      </div>
      <Table>
        <TableCaption>list of examineers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Grade and Section</TableHead>
            <TableHead>Birthdate</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Guardian</TableHead>
            <TableHead>Guardian Contact</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length ? (
            filteredUsers.map((user, index) => {
              const originalIndex = users.findIndex((u) => u._id === user._id);
              return (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {originalIndex + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {[user.firstName, user.middleName, user.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{[user.grade, user.section].filter(Boolean).join(' - ') || 'N/A'}</TableCell>
                  <TableCell>{moment(user.birthdate).format("ll")}</TableCell>
                  <TableCell>{user.contact}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.guardian}</TableCell>
                  <TableCell>{user.guardianContact}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* <Pencil
                        color="green"
                        size={18}
                        className="cursor-pointer"
                      /> */}
                      <Trash
                        color="red"
                        size={18}
                        className="cursor-pointer"
                        onClick={() => {
                          setOpenDialog(true);
                          setUserToDelete(user._id);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell className="font-medium text-center !py-5" colSpan={10}>
                No user to show
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* alert dialog for deleting */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
                Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className={`${deleting && 'animate-pulse'}`} onClick={() => deleteUser()} disabled={deleting}>
              {deleting ? 'Deleting' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Users;
