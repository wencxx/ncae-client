import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Users } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "@/auth/auth-context";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ExaminationsList() {
  const { userData } = useAuth();
  const [examinations, setExaminations] = useState([]);

  // get examination
  const getExamination = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}quiz/get-active`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        setExaminations(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getExamination();
  }, []);

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Available Examinations
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse through our collection of examinations and assessments. Click
          on "Take Exam" to begin your assessment.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examinations.length ? (
          examinations.map((exam) => (
            <Card key={exam?._id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{exam?.quizName}</CardTitle>
                  <Badge
                    variant={
                      exam?.takeUsers?.includes(userData?._id)
                        ? "completed"
                        : "pending"
                    }
                  >
                    {exam?.takeUsers?.includes(userData?._id)
                      ? "Completed"
                      : "pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="grid gap-2">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{exam?.timeLimit} minutes</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{exam?.questions.length} questions</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {moment(exam?.createdAt).format("LLL")}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                {!exam?.takeUsers?.includes(userData?._id) ? (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger className="w-full" asChild> 
                        <Button className="w-full">Take Exam</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Do you want to proceed?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="space-y-2 p-3">
                              <h3 className="font-semibold text-lg">
                                You are about to begin your examination. Please
                                note the following:
                              </h3>
                              <ul className="list-disc">
                                <li>
                                  Clicking Continue will start the timer for the
                                  exam.
                                </li>
                                <li>
                                  Once you begin, the timer will be active, and
                                  the exam cannot be paused.
                                </li>
                                <li>
                                  If you leave this page or change tab, your progress will be
                                  automatically saved, and you will not be able
                                  to retake the exam.
                                </li>
                                <li>
                                  Make sure you're ready to start before
                                  proceeding.
                                </li>
                              </ul>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>
                            <Link
                              to={`/take-exam/${exam?._id}`}
                              className="w-full"
                            >
                              Continue
                            </Link>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <Button className="w-full !cursor-not-allowed bg-gray-500 hover:bg-gray-500">
                    Take Exam
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full pt-2">
            <p className="text-center">No examinations available</p>
          </div>
        )}
      </div>
    </>
  );
}
