import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/auth/auth-context";

export default function TakeExamPage() {
  const { userData } = useAuth()
  const [examData, setExamData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(examData?.timeLimit * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate()

  const getExam = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}quiz/get-quiz/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        setExamData(res.data);
        setTimeRemaining(res.data.timeLimit * 60);
      } else {
        setExamData(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getExam();
    }
  }, [id]);

  const currentQuestion = examData?.questions[currentQuestionIndex];
  const totalQuestions = examData?.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0 || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  // Handle answer selection
  const handleAnswerSelect = (value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // submit on tab change
  useEffect(() => {
    if(examData?.takeUsers.includes(userData?._id)){
      navigate('/examinations-list')
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleSubmit()
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examData, userData]);

  // Submit exam
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    let correctAnswers = 0;

    examData?.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const percent = (correctAnswers / examData?.questions.length) * 100;

    const data = {
      score: correctAnswers,
      percentage: percent || 0,
      quizId: id,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}answer/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        setScore(correctAnswers);
        setIsSubmitted(true);
      } else {
        toast.error("Failed submitting quiz");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed submitting quiz");
    } finally {
      setLoading(false);
    }
    // In a real application, you would send the results to your backend here
    // Example: submitExamResults(params.id, selectedAnswers)
  };

  // Check if all questions have been answered
  const allQuestionsAnswered = examData?.questions.every(
    (question) => selectedAnswers[question.id]
  );

  // Determine if the current answer is correct (only shown after submission)
  const isCurrentAnswerCorrect =
    isSubmitted &&
    selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer;

  return (
    <>
      {examData ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{examData?.quizName}</h1>
              <p className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1">
              <Clock className="h-4 w-4" />
              <span
                className={`font-mono ${
                  timeRemaining < 60 ? "text-red-500 font-bold" : ""
                }`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <Progress value={progress} className="mb-6 h-2" />

          {isSubmitted && (
            <Alert
              className="mb-6"
              variant={score === totalQuestions ? "default" : "destructive"}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Exam Completed</AlertTitle>
              <AlertDescription>
                You scored {score} out of {totalQuestions} (
                {Math.round((score / totalQuestions) * 100)}%)
                <br></br>
                <Link
                  to="/examinations-list"
                  className="text-neutral-500 underline"
                >
                  Back to exam list
                </Link>
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <CardDescription>{currentQuestion?.text}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswers[currentQuestion?.id] || ""}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
                disabled={isSubmitted}
              >
                {currentQuestion?.choices.map((choice) => (
                  <div
                    key={choice.id}
                    className={`flex items-center space-x-2 rounded-md border p-4 ${
                      isSubmitted
                        ? choice.id === currentQuestion?.correctAnswer
                          ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                          : selectedAnswers[currentQuestion?.id] === choice.id
                          ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                          : ""
                        : ""
                    }`}
                  >
                    <RadioGroupItem value={choice.id} id={choice.id} />
                    <Label
                      htmlFor={choice.id}
                      className="flex w-full cursor-pointer justify-between"
                    >
                      {choice.text}
                      {isSubmitted &&
                        choice.id === currentQuestion?.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <Button onClick={handleNextQuestion}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                !isSubmitted && (
                  <Button
                    onClick={handleSubmit}
                    disabled={!allQuestionsAnswered || loading}
                    className={`bg-green-600 hover:bg-green-700 ${
                      loading && "animate-pulse"
                    }`}
                  >
                    {loading ? "Submitting Exam" : "Submit Exam"}
                  </Button>
                )
              )}
            </CardFooter>
          </Card>

          {!isSubmitted && (
            <div className="flex flex-wrap gap-2">
              {examData?.questions.map((question, index) => (
                <Button
                  key={question.id}
                  variant={selectedAnswers[question.id] ? "default" : "outline"}
                  size="sm"
                  className={`h-10 w-10 ${
                    currentQuestionIndex === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="animate-pulse text-center">Loading exam data...</p>
      )}
    </>
  );
}
