import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionItem } from "@/components/examinations/question-item";
import { PlusCircle } from "lucide-react";

export function ExaminationForm({ onSubmit, onCancel }) {
  const [quizName, setName] = useState("");
  const [timeLimit, setTimeLimit] = useState(1);
  const [questions, setQuestions] = useState([
    {
      text: "",
      choices: [
        { id: crypto.randomUUID(), text: "" },
        { id: crypto.randomUUID(), text: "" },
        { id: crypto.randomUUID(), text: "" },
        { id: crypto.randomUUID(), text: "" },
      ],
      correctAnswer: "",
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        choices: [
          { id: crypto.randomUUID(), text: "" },
          { id: crypto.randomUUID(), text: "" },
          { id: crypto.randomUUID(), text: "" },
          { id: crypto.randomUUID(), text: "" },
        ],
        correctAnswer: "",
      },
    ]);
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add IDs to questions
    const questionsWithIds = questions.map((q) => ({
      ...q,
      id: crypto.randomUUID(),
    }));

    onSubmit({
      quizName,
      timeLimit,
      questions: questionsWithIds,
    });
  };

  return (
    <Card className="w-full mt-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2 mt-2">
            <Label htmlFor="exam-name">Examination Name</Label>
            <Input
              id="exam-name"
              value={quizName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter examination name"
              required
            />
          </div>
          <div className="space-y-2 mt-2">
            <Label htmlFor="exam-name">Time Limit (in minutes)</Label>
            <Input
              id="exam-name"
              value={timeLimit}
              type="number"
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="Enter time limit"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Questions</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddQuestion}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>

            {questions.map((question, index) => (
              <QuestionItem
                key={index}
                question={question}
                questionNumber={index + 1}
                onChange={(updatedQuestion) =>
                  handleQuestionChange(index, updatedQuestion)
                }
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 mt-5">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Examination</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
