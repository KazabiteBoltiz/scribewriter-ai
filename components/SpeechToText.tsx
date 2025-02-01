"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Globe, Scan } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CustomToast } from "./ui/custom-toast"

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

export default function SpeechToTextTranslator() {
  const [text, setText] = useState<string>("")
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [language, setLanguage] = useState<string>("es")
  const [showToast, setShowToast] = useState<boolean>(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const copyTextToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setShowToast(true)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const startRecording = async () => {
    if (isRecording) {
      stopRecording()
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
        const audioChunks: Blob[] = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
          const reader = new FileReader()

          reader.readAsDataURL(audioBlob)
          reader.onloadend = async () => {
            const base64Audio = reader.result?.toString().split(",")[1]

            if (!base64Audio) {
              console.error("Failed to convert audio to Base64")
              return
            }

            // Send audio to Google Cloud Speech-to-Text API
            const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                config: {
                  encoding: "WEBM_OPUS",
                  sampleRateHertz: 48000,
                  languageCode: "en-US",
                },
                audio: { content: base64Audio },
              }),
            })

            const data = await response.json()
            if (data.results) {
              setText(data.results.map((result: any) => result.alternatives[0].transcript).join(" "))
            } else {
              console.log("No transcription results:", data)
            }
          }
        }

        mediaRecorder.start()
        mediaRecorderRef.current = mediaRecorder
        setIsRecording(true)
      } catch (error) {
        console.error("Microphone access error:", error)
      }
    }
  }

  const translateText = async (text: string, targetLang: string) => {
    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          target: targetLang,
        }),
      })

      const data = await response.json()
      if (data.data && data.data.translations) {
        return data.data.translations[0].translatedText
      } else {
        console.error("Error with translation:", data)
        return text
      }
    } catch (error) {
      console.error("Error with translation API:", error)
      return text
    }
  }

  const stopRecording = async () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)

    // Translate the transcribed text to the selected language
    const translatedText = await translateText(text, language)
    setText(translatedText)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-4 via-blue-5 to-blue-6 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className = 'aspect-[1.5] items-center'
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Card className="w-full items-center bg-white-4">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <Input
                    disabled={true}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Your speech appears here..."
                    className="pr-10 bg-white-3 min-h-[100px] resize-none"
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute right-2 top-2">
                  <Button
                    onClick={startRecording}
                    className={`text-grey-4 rounded-full p-2 transition-all duration-300 ease-in-out ${
                      isRecording
                        ? "transition-all animate-bounce bg-gradient-to-br from-yellow-6 to-red-5"
                        : "bg-gradient-to-br from-blue-400 to-purple-600"
                    }`}
                  >
                    <Mic className={`h-5 w-5 ${isRecording ? "animate-pulse stroke-white-4" : "stroke-grey-4"}`} />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute right-2 bottom-2">
                  <Button
                    disabled={isRecording}
                    onClick={copyTextToClipboard}
                    className={`text-grey-4 rounded-full p-2 transition-all duration-300 ease-in-out ${
                      isRecording
                        ? "transition-all bg-gradient-to-br from-orange-400 to-red-800"
                        : "bg-gradient-to-br from-blue-400 to-purple-600"
                    }`}
                  >
                    <Scan className={`h-5 w-5 ${isRecording ? "animate-pulse" : ""}`} />
                  </Button>
                </motion.div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={startRecording}
                  className={`transition-all text-grey-4 w-full ${
                    isRecording ? "text-blue-4 grey-3" : "text-grey-4 bg-gradient-to-r from-gray-500 to-gray-600"
                  }  transition-all duration-300 ease-in-out transform hover:scale-105`}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isRecording ? "recording" : "not-recording"}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`text-md font-bold ${isRecording ? "text-yellow-6" : "text-grey-5"}`}
                    >
                      {isRecording ? "Finish" : "Start Listening"}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-grey-4 mt-6 p-4 border border-dashed border-10 border-grey-4 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <Select disabled={isRecording} value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full bg-white shadow-none">
                    <SelectValue placeholder={"es"} className="shadow-none" />
                  </SelectTrigger>
                  <SelectContent className="bg-white-4">
                    <SelectItem className="bg-white-4 text-grey-4" value="es">
                      Spanish
                    </SelectItem>
                    <SelectItem className="bg-white-4 text-grey-4" value="fr">
                      French
                    </SelectItem>
                    <SelectItem className="bg-white-4 text-grey-4" value="de">
                      German
                    </SelectItem>
                    <SelectItem className="bg-white-4 text-grey-4" value="it">
                      Italian
                    </SelectItem>
                    <SelectItem className="bg-white-4 text-grey-4" value="pt">
                      Portuguese
                    </SelectItem>
                  </SelectContent>
                </Select>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    disabled={isRecording}
                    onClick={stopRecording}
                    className="bg-gradient-to-br from-blue-400 to-purple-600 transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full"
                  >
                    <Globe className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      {showToast && <CustomToast message="Text copied to clipboard!" onClose={() => setShowToast(false)} />}
    </motion.div>
  )
}

