# ScribeWriter.io

Built on NextJS 15, **shadcn/ui**, **tailwindcss** and it incorporates the **Gemini API** for text generation based on the topic and keywords/bullet points provided. We make use of Google Cloud's API services like Google's built-in **SpeechRecognition Speech To Text (STT)** and the **Google Translate API** for the _Multilingual Microphone feature_.​

The _Elaborator_ works on top of **Gemini 1.5**, and takes in a prompt in the form of a json request and also returns a json table containing any errors or messages. There's a keyword system in the Elaborator, which takes in words/phrases and on pressing the Enter key or clicking the "Add" button, adds it to the keypoints list. We send this to the Gemini API through the prompt json table and display the response in the textbox.​
