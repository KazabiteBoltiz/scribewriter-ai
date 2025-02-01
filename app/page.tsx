import Link from "next/link"
import { Mic, PenTool } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-2 to-green-2 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-white-4 mb-8 text-center">ScribeWriter.io</h1>
      <p className="text-xl md:text-2xl text-white-3 mb-12 text-center max-w-2xl">
        Transcribe speech in multiple languages and create elaborate passages with ease.
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <Link href="/SpeechToText" className="w-full md:w-1/2">
          <div className="bg-gradient-to-br from-blue-4 to-blue-6 rounded-lg p-6 h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col items-center justify-center text-center">
            <Mic className="stroke-grey-4 w-16 h-16 text-white-4 mb-4" />
            <h2 className="text-2xl font-bold text-grey-4 mb-2">Multilingual Mic</h2>
            <p className="text-grey-4">
              Transcribe speech in multiple languages with our advanced speech recognition technology.
            </p>
          </div>
        </Link>

        <Link href="/Elaborator" className="w-full md:w-1/2">
          <div className="bg-gradient-to-br from-green-4 to-green-6 rounded-lg p-6 h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col items-center justify-center text-center">
            <PenTool className="stroke-grey-4 w-16 h-16 text-white-4 mb-4" />
            <h2 className="text-2xl font-bold text-grey-4 mb-2">Elaborator</h2>
            <p className="text-grey-4">
              Generate detailed passages based on your title and keywords. Perfect for content creation.
            </p>
          </div>
        </Link>
      </div>

      <footer className="mt-16 text-white-3 text-center">
        <p>*Team member names here*</p>
      </footer>
    </div>
  )
}

