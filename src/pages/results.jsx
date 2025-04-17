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
import { Clock, FileText, Percent, Award, BookOpen } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "@/auth/auth-context";
import moment from "moment";

export default function Results() {
  const { userData } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [overallGrade, setOverallGrade] = useState();
  const [recommendedStrand, setRecommendedStrand] = useState([]);

  // get examination
  const getExamination = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}answer/get-answers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        setAnswers(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getExamination();

    if (answers) {
      const sum = answers.reduce((acc, curr) => acc + curr.percentage, 0);
      const overAll = sum / answers.length;

      const passedStrands = userData?.prefferedStrand.filter(strand => strand.passingGrade <= overAll)
      setOverallGrade(overAll);
      setRecommendedStrand(passedStrands)
    }
  }, [answers]);

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Examinations Result
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          View your exam scores and see the Recommended Strand based on your selected preference.
          performance. This helps you choose the most suitable academic track
          aligned with your strengths.
        </p>
      </div>

      {/* Recommended Strands Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center">
          <BookOpen className="mr-2 h-5 w-5" /> Recommended Strands
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recommendedStrand?.length ? (
            recommendedStrand?.map((strand, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{strand.strandAbbr}</CardTitle>
                    <Award className="h-8 w-8 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {strand.strandName}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            'No recommended strand'
          )}
        </div>
      </div>

      {/* Exam Results Section */}
      <h2 className="text-2xl font-bold tracking-tight mb-1 flex items-center">
        <FileText className="mr-2 h-5 w-5" /> Exam Results (Total Grade: {overallGrade}%)
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {answers.length ? (
          answers.map((ans) => (
            <Card key={ans?._id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">
                    {ans?.quizId.quizName}
                  </CardTitle>
                  <Badge
                    variant={
                      ans?.percentage >= ans?.quizId.passingGrade
                        ? "completed"
                        : "destructive"
                    }
                  >
                    {ans?.percentage >= ans?.quizId.passingGrade
                      ? "Passed"
                      : "Fail"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="grid gap-2">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{ans?.quizId.timeLimit} minutes</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{ans?.quizId.questions.length} questions</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {ans?.score}/{ans?.quizId.questions.length} questions
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Percent className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{ans?.percentage}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {moment(ans?.quizId.createdAt).format("LLL")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full pt-2">
            <p className="text-center">No answers available</p>
          </div>
        )}
      </div>
    </>
  );
}
