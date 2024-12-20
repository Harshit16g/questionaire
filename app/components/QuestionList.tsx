'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { generateQuestions } from '../actions'

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>([])
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const fetchQuestions = useCallback(async () => {
    const exam = searchParams.get('exam')
    const topic = searchParams.get('topic')
    const difficulty = searchParams.get('difficulty')

    if (!exam || !topic || !difficulty) {
      setError('Missing required parameters')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await generateQuestions(exam, topic, difficulty)
      setQuestions(data)
      setRevealedAnswers(new Array(data.length).fill(false))
    } catch (error) {
      console.error('Error fetching questions:', error)
      setError(error instanceof Error ? error.message : 'Failed to load questions')
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    const exam = searchParams.get('exam')
    const topic = searchParams.get('topic')
    const difficulty = searchParams.get('difficulty')

    if (exam && topic && difficulty) {
      // Only fetch if we don't have questions or if search params changed
      fetchQuestions()
    }
  }, [fetchQuestions])

  const toggleAnswer = (index: number) => {
    setRevealedAnswers(prev => {
      const newRevealed = [...prev]
      newRevealed[index] = !newRevealed[index]
      return newRevealed
    })
  }

  if (loading) {
    return <div className="p-4">Loading questions...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>
  }

  if (questions.length === 0) {
    return <div className="p-4">No questions available. Please select an exam, topic, and difficulty level.</div>
  }

  return (
    <div className="space-y-6 p-4">
      {questions.map((question, index) => (
        <div key={index} className="border rounded-lg shadow-sm p-6 bg-white">
          <h3 className="font-bold text-lg mb-4">{`${index + 1}. ${question.question}`}</h3>
          <ul className="space-y-2 mb-4">
            {question.options.map((option, optionIndex) => (
              <li 
                key={optionIndex} 
                className="ml-4 pl-2"
              >
                {`${String.fromCharCode(65 + optionIndex)}. ${option}`}
              </li>
            ))}
          </ul>
          <div
            className={`mt-4 p-3 border rounded-md cursor-pointer transition-all
              ${revealedAnswers[index] ? 'bg-green-50' : 'blur-sm hover:blur-[6px]'}
            `}
            onClick={() => toggleAnswer(index)}
          >
            <span className="font-medium">Correct Answer: </span>
            {`${String.fromCharCode(65 + question.correctAnswer)}. ${question.options[question.correctAnswer]}`}
          </div>
        </div>
      ))}
    </div>
  )
}

