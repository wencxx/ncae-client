import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  strandAbbr: z.string().nonempty("Strand code is required"),
  strandName: z.string().nonempty("Strand name is required"),
  passingGrade: z.string().nonempty("Passing grade is required"),
});

function Strand() {
  const [open, setOpen] = useState(false);

  // get strands
  const [strands, setStrands] = useState([]);

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
        setStrands(res.data);
      } else {
        setStrands([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStrand();
  }, []);

  // add strands
  const [adding, setAdding] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      strandAbbr: "",
      strandName: "",
      passingGrade: "",
    },
  });

  const onSubmit = async (values) => {
    console.log(values);

    try {
      setAdding(true);
      const res = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}strands/add`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        getStrand();
        toast.success("Added strand successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.error("Server error", {
        description: "Please try again later",
      });
    } finally {
      setAdding(false);
    }
  };

  // delete strand
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [strandToDelete, setStrandToDelete] = useState("");
  const [deleting, setDeleting] = useState(false);

  const deleteStrand = async (strandID) => {
    setStrandToDelete(strandID);
    setOpenAlertDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      const res = await axios.delete(
        `${import.meta.env.VITE_ENDPOINT}strands/delete/${strandToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(res.data)

      if (res.status === 200) {
        toast.success("Deleted strand successfully");
        setStrands(strands.filter((strand) => strand._id !== strandToDelete));
      } else {
        toast.error("Failed deleting strand", {
          description: "Please try again later",
        });
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed deleting strand", {
        description: "Please try again later.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Strand Lists</h1>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <Plus />
          Add new Strand
        </Button>
      </div>
      <Table>
        <TableCaption>list of strands offered.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Strand Code</TableHead>
            <TableHead>Strand Description</TableHead>
            <TableHead>Passing Grade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {strands.length ? (
            strands.map((strand) => (
              <TableRow key={strand._id} className={`${deleting && strand._id === strandToDelete && 'animate-pulse bg-gray-200'}`}>
                <TableCell className="font-medium">
                  {strand.strandAbbr}
                </TableCell>
                <TableCell>{strand.strandName}</TableCell>
                <TableCell>{strand.passingGrade}%</TableCell>
                <TableCell>{strand.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Pencil
                      color="green"
                      size={18}
                      className="cursor-pointer"
                    />
                    <Trash
                      color="red"
                      size={18}
                      className="cursor-pointer"
                      onClick={() => deleteStrand(strand._id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="font-medium text-center !py-5" colSpan={5}>
                No data to show
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* dialog for adding */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Strand</DialogTitle>
            <DialogDescription>
              Fill out all fields to add a new strand.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="strandAbbr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strand Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex. HUMSS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="strandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strand Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex. Humanities and Social Sciences"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passingGrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passing Grade (in %)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex. 90" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className={`float-end ${adding && "animate-pulse"}`}
                  disabled={adding}
                >
                  {adding ? "Adding Strand" : "Add Strand"}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* alert dialog for deleting */}
      <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              strand and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={`bg-red-500 hover:bg-red-600 ${deleting && 'animate-pulse'}`}
              onClick={() => confirmDelete()}
            >
              {deleting ? 'Deleting' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Strand;
