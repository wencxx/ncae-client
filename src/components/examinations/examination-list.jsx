import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ExaminationForm } from "@/components/examinations/examination-form";
import { Pencil, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { formatDate } from "@/lib/date-formatter";

export function ExaminationList() {
  const [examinations, setExaminations] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // handle add examination
  const [loading, setLoading] = useState(false)
  const handleAddExamination = async (examination) => {
    try {
      setLoading(true)
      const newExamination = {
        ...examination,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}quiz/add`,
        newExamination,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        toast.success("Added examination successfully");
        getExamination();
        setIsFormOpen(false);
      }
    } catch (error) {
      toast.error("Failed to add new examination", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false)
    }
  };

  // get examination
  const getExamination = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_ENDPOINT}quiz/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        validateStatus: (status) => status < 500,
      });

      if (res.status === 200) {
        setExaminations(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed fetching examinations", {
        description: "Please log out and try again.",
      });
    }
  };

  useEffect(() => {
    getExamination();
  }, []);

  // delete examination
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [examToDelete, setExamToDelete] = useState('')

  const deleteExamination = (examId) => {
    setOpenAlertDialog(true)
    setExamToDelete(examId)
  };

  const confirmDelete = async () => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_ENDPOINT}quiz/delete/${examToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          validateStatus: status => status < 500
        })

        if(res.status === 200){
          setExaminations(examinations.filter(exam => exam._id !== examToDelete))
          toast.success('Exam deleted successfully')
        }else{
          toast.error('Failed to delete examination')
        }
    } catch (error) {
      toast.error('Failed to delete examination', {
        description: 'Please try again later'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Examination Lists</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Examination
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Examination Name</TableHead>
            <TableHead>Number of Questions</TableHead>
            <TableHead>Time Limit</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {examinations.length ? (
            examinations.map((exam) => (
              <TableRow key={exam._id}>
                <TableCell className="font-medium">{exam.quizName}</TableCell>
                <TableCell>{exam.questions.length}</TableCell>
                <TableCell>{exam.timeLimit}</TableCell>
                <TableCell>{formatDate(exam.createdAt)}</TableCell>
                <TableCell>{exam.status}</TableCell>
                <TableCell>
                  <div className="flex gap-x-1">
                    <Pencil color="green" size={18} className="cursor-pointer" />
                    <Trash color="red" size={18} className="cursor-pointer" onClick={() => deleteExamination(exam._id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center py-5" colSpan={5}>
                No examinations available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* dialog for adding new examination */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="!max-w-4xl !max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add new examination</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <ExaminationForm
            onSubmit={handleAddExamination}
            loading={loading}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* alert dialog for deleting exam */}
      <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDelete()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
