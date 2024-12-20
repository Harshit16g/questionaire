'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ChevronLeft, ChevronRight, BookOpen, RefreshCcw } from 'lucide-react'
import { generateQuestions } from '../actions'

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TopicReference {
  [key: string]: {
    title: string;
    url: string;
  }[];
}

const topicReferences: TopicReference = {
  'physics': [
    { title: 'Khan Academy - Physics', url: 'https://www.khanacademy.org/science/physics' },
    { title: 'Physics Classroom', url: 'https://www.physicsclassroom.com/' },
  ],
  'chemistry': [
    { title: 'Khan Academy - Chemistry', url: 'https://www.khanacademy.org/science/chemistry' },
    { title: 'Chemistry LibreTexts', url: 'https://chem.libretexts.org/' },
  ],
  // Add more topics as needed
};

export default function QuestionChat() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [revealAnswer, setRevealAnswer] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [attemptedQuestions, setAttemptedQuestions] = useState<Set<number>>(new Set())
  const searchParams = useSearchParams()
  const paramsString = searchParams.toString()
  const fetchingRef = useRef(false)
  const router = useRouter()

  const fetchQuestions = useCallback(async () => {
    const exam = searchParams.get('exam')
    const topic = searchParams.get('topic')
    const difficulty = searchParams.get('difficulty')

    if (!exam || !topic || !difficulty || fetchingRef.current) return

    try {
      fetchingRef.current = true
      setLoading(true)
      setError(null)
      setShowCompletion(false)
      const data = await generateQuestions(exam, topic, difficulty)
      if (data && Array.isArray(data) && data.length > 0) {
        setQuestions(data)
        setAttemptedQuestions(new Set())
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error in fetchQuestions:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate questions'
      setError(errorMessage)
      setQuestions([])
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [searchParams])

  useEffect(() => {
    setCurrentQuestionIndex(0)
    setRevealAnswer(false)
    setQuestions([])
    setError(null)
    setShowCompletion(false)
    
    const exam = searchParams.get('exam')
    const topic = searchParams.get('topic')
    const difficulty = searchParams.get('difficulty')

    if (exam && topic && difficulty) {
      fetchQuestions()
    }
  }, [paramsString])

  const handleAnswerReveal = () => {
    setRevealAnswer(true)
    setAttemptedQuestions(prev => new Set(prev).add(currentQuestionIndex))
    
    // Check if all questions have been attempted
    if (attemptedQuestions.size + 1 === questions.length && currentQuestionIndex === questions.length - 1) {
      setShowCompletion(true)
    }
  }

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setRevealAnswer(false)
    }
  }, [currentQuestionIndex, questions.length])

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setRevealAnswer(false)
    }
  }, [currentQuestionIndex])

  const handleChooseTopic = () => {
    router.push('/')  // Assuming your topic selection form is on the home page
  }

  const currentQuestion = questions[currentQuestionIndex]
  const topic = searchParams.get('topic')?.toLowerCase() || ''
  const references = topicReferences[topic] || []

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => {
              setError(null)
              fetchQuestions()
            }}
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>No questions available. Please select an exam, topic, and difficulty level.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Question {currentQuestionIndex + 1} of {questions.length}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleChooseTopic}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Choose Topic
            </Button>
          </div>
          <p className="mb-4">{currentQuestion.question}</p>
          <ul className="list-none space-y-2">
            {currentQuestion.options.map((option, index) => (
              <li key={index} className="text-muted-foreground">
                {`${String.fromCharCode(65 + index)}. ${option}`}
              </li>
            ))}
          </ul>
          <div
            className={`mt-4 p-4 border rounded cursor-pointer transition-all duration-300 ${
              revealAnswer ? 'bg-green-100 dark:bg-green-900' : 'bg-muted blur-sm hover:blur-none'
            }`}
            onClick={handleAnswerReveal}
          >
            <span className="font-medium">
              Correct Answer: {`${String.fromCharCode(65 + currentQuestion.correctAnswer)}. ${currentQuestion.options[currentQuestion.correctAnswer]}`}
            </span>
          </div>
        </CardContent>
        {showCompletion && (
          <CardFooter className="bg-muted/50 p-4 mt-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Well done! You've completed all questions.</h4>
                <Button
                  onClick={fetchQuestions}
                  className="flex items-center gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Get More Questions
                </Button>
              </div>
              {references.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Additional Resources:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {references.map((ref, index) => (
                      <li key={index}>
                        <a 
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {ref.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
      <div className="flex justify-between">
        <Button 
          onClick={handlePreviousQuestion} 
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button 
          onClick={handleNextQuestion} 
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

