"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PenTool, Trash, Sparkles, Scan } from "lucide-react"
import { generateResponse } from "@/lib/gemini"
import { motion, AnimatePresence } from "framer-motion"

const constraints = `
do not write every point as a separate heading
`

const EnhancedElaboratorComp = () => {
  const [title, setTitle] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [currentKeyword, setCurrentKeyword] = useState("")
  const [essay, setEssay] = useState("")
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState<boolean>(false)

  const addKeyword = () => {
    if (currentKeyword && !keywords.includes(currentKeyword)) {
      setKeywords([...keywords, currentKeyword])
      setCurrentKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword))
  }

  const copyTextToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(essay)
      setShowToast(true)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const fetchAIResponse = async () => {
    if (!title) return

    setLoading(true)

    let prompt = `write a professional sounding writeup on "${title}". Here are the points to be written about- ${keywords.join(", ")}`
    prompt += ". " + constraints

    console.log(`Sent prompt! ${prompt}`)

    let response = await generateResponse(prompt)
    response = response.replace(/[*#]/g, "")
    setEssay(response)

    console.log(`Received response! ${response}`)

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-4 via-yellow-5 to-yellow-6 p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-white-3 shadow-xl">
          <CardContent className="p-8 space-y-6">
            <motion.div whileHover={{ scale :1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Main Topic"
                className="text-3xl h-16 font-semibold bg-white-4 border-none transition-all duration-300 focus:ring-2 focus:ring-yellow-4 focus:bg-white-4 placeholder-yellow-3"
              />
            </motion.div>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  placeholder="Add keywords and main points"
                  className="bg-white-4 border-none focus:bg-white-4 transition-all duration-300 focus:ring-2 focus:ring-yellow-4 placeholder-yellow-3"
                  onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                />
                <Button
                  onClick={addKeyword}
                  className="font-bold font-bold font-bold bg-gradient-to-br from-yellow-4 to-yellow-5 hover:from-yellow-5 hover:to-yellow-6 text-grey-4 transition-all duration-300 transform hover:scale-105 transition-all duration-300 transform hover:scale-105"
                >
                  Add
                </Button>
              </div>
              <motion.div layout className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {keywords.map((keyword, index) => (
                    <motion.span
                      key={keyword}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="ring ring-1 ring-grey-4 bg-yellow-4 text-grey-4 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-2 text-white-1 hover:text-red-3 transition-colors"
                      >
                        <Trash className="w-4 stroke-grey-4 h-4" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
                <Button
                    disabled={loading || essay === ''}
                    onClick={copyTextToClipboard}
                    className={`text-grey-4 rounded-full p-2 transition-all duration-300 ease-in-out font-bold bg-gradient-to-br from-yellow-4 to-yellow-5 hover:from-yellow-5 hover:to-yellow-6 text-grey-4 transition-all duration-300 transform hover:scale-105`}
                >
                    Copy To Clipboard <Scan className={`h-5 w-5 ${loading ? "animate-pulse" : ""}`} />
                </Button>
              </motion.div> 
            </div>

            <Textarea
              value={essay}
              disabled={loading || essay === ''}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Generated text will appear here..."
              className="w-full h-64 p-4 text-lg resize-none bg-white-3 font-bold text-grey-4 transition-all duration-300 focus:ring-2 focus:ring-yellow-4 border-none placeholder-yellow-3"
            />

            <Button
              onClick={fetchAIResponse}
              disabled={!title || keywords.length === 0 || loading}
              className={`font-bold w-full ${
                loading ? "bg-grey-4 text-yellow-4" : "font-bold bg-gradient-to-br from-yellow-4 to-yellow-5 hover:from-yellow-5 hover:to-yellow-6 text-grey-4 transition-all duration-300 transform hover:scale-105"
              } transition-all duration-300 transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed h-14 text-lg`}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 stroke-grey-4" />
                </motion.div>
              ) : (
                <>
                  <PenTool className="w-6 h-6 mr-2 stroke-grey-4" />
                  GENERATE!
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default EnhancedElaboratorComp

