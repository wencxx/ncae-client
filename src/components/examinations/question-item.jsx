import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function QuestionItem({ question, questionNumber, onChange }) {
  const handleQuestionTextChange = (text) => {
    onChange({
      ...question,
      text,
    })
  }

  const handleChoiceChange = (index, text) => {
    const updatedChoices = [...question.choices]
    updatedChoices[index] = { ...updatedChoices[index], text }

    onChange({
      ...question,
      choices: updatedChoices,
    })
  }

  const handleCorrectAnswerChange = (choiceId) => {
    onChange({
      ...question,
      correctAnswer: choiceId,
    })
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`question-${questionNumber}`}>Question {questionNumber}</Label>
          <Input
            id={`question-${questionNumber}`}
            value={question.text}
            onChange={(e) => handleQuestionTextChange(e.target.value)}
            placeholder="Enter your question"
            required
          />
        </div>

        <div className="space-y-3">
          <Label>Choices</Label>
          <RadioGroup value={question.correctAnswer} onValueChange={handleCorrectAnswerChange}>
            {question.choices.map((choice, index) => (
              <div key={choice.id} className="flex items-center space-x-2">
                <RadioGroupItem value={choice.id} id={`choice-${questionNumber}-${index}`} />
                <div className="flex-1">
                  <Input
                    value={choice.text}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    placeholder={`Choice ${index + 1}`}
                    required
                  />
                </div>
                <Label htmlFor={`choice-${questionNumber}-${index}`} className="text-xs text-muted-foreground">
                  {index === 0 ? "A" : index === 1 ? "B" : index === 2 ? "C" : "D"}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <p className="text-xs text-muted-foreground">Select the radio button next to the correct answer</p>
        </div>
      </CardContent>
    </Card>
  )
}
