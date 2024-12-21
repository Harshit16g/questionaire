<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a2d4f62 (	modified:   .gitignore)
import { Suspense } from 'react'
import ExamForm from './components/ExamForm'
import QuestionChat from './components/QuestionChat'
import { Card } from "@/components/ui/card"
<<<<<<< HEAD

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 max-w-2xl">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-center">Exam Question Generator</h1>
          <Suspense>
            <ExamForm />
          </Suspense>
          <Suspense>
            <QuestionChat />
          </Suspense>
        </Card>
      </main>
    </div>
  )
}

=======
import Image from "next/image";
=======
>>>>>>> a2d4f62 (	modified:   .gitignore)

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 max-w-2xl">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-center">Exam Question Generator</h1>
          <Suspense>
            <ExamForm />
          </Suspense>
          <Suspense>
            <QuestionChat />
          </Suspense>
        </Card>
      </main>
    </div>
  )
}
<<<<<<< HEAD
>>>>>>> 7f29f71 (Initial commit from Create Next App)
=======

>>>>>>> a2d4f62 (	modified:   .gitignore)
