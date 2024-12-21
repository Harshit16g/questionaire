'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import { Input } from "@/components/ui/input"
=======
>>>>>>> a2d4f62 (	modified:   .gitignore)
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

<<<<<<< HEAD
=======
const popularExams = [
  "SAT", "ACT", "GRE", "GMAT", "LSAT", "MCAT", "TOEFL", "IELTS",
  "AP Biology", "AP Chemistry", "AP Physics", "AP Calculus",
]

const popularTopics = [
  "Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature",
  "Computer Science", "Economics", "Psychology", "Political Science",
]

>>>>>>> a2d4f62 (	modified:   .gitignore)
export default function ExamForm() {
  const [exam, setExam] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
<<<<<<< HEAD
=======
    if (!exam || !topic) {
      setError('Please select both an exam and a topic')
      return
    }
>>>>>>> a2d4f62 (	modified:   .gitignore)
    try {
      console.log('Submitting form with:', { exam, topic, difficulty });
      router.push(`/?exam=${encodeURIComponent(exam)}&topic=${encodeURIComponent(topic)}&difficulty=${difficulty}`)
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred. Please try again.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div className="space-y-2">
        <Label htmlFor="exam">Exam Name</Label>
<<<<<<< HEAD
        <Input
          id="exam"
          value={exam}
          onChange={(e) => setExam(e.target.value)}
          placeholder="Enter exam name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic"
          required
        />
=======
        <Select value={exam} onValueChange={setExam}>
          <SelectTrigger>
            <SelectValue placeholder="Select an exam" />
          </SelectTrigger>
          <SelectContent>
            {popularExams.map((examName) => (
              <SelectItem key={examName} value={examName}>
                {examName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Select value={topic} onValueChange={setTopic}>
          <SelectTrigger>
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            {popularTopics.map((topicName) => (
              <SelectItem key={topicName} value={topicName}>
                {topicName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
>>>>>>> a2d4f62 (	modified:   .gitignore)
      </div>
      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full">Generate Questions</Button>
    </form>
  )
}

<<<<<<< HEAD
=======

>>>>>>> a2d4f62 (	modified:   .gitignore)
