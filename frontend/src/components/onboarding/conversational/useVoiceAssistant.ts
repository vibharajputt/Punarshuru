import { useState, useRef, useEffect } from 'react'
import { voiceApi } from '@/lib/api'

interface UseVoiceAssistantProps {
  voiceLang: 'hi-IN' | 'en-IN'
  onTranscript: (text: string) => void
}

export function useVoiceAssistant({ voiceLang, onTranscript }: UseVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isRecordingFallback, setIsRecordingFallback] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch { /* ignore */ }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = voiceLang

      recognition.onresult = (event: any) => {
        let currentTranscript = ''
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' '
        }
        onTranscript(currentTranscript.trim())
      }
      recognition.onerror = () => setIsListening(false)
      recognition.onend = () => setIsListening(false)
      recognitionRef.current = recognition
    } else {
      recognitionRef.current = null
    }
  }, [voiceLang, onTranscript])

  const startFallbackRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setIsTranscribing(true)
        try {
          const resp = await voiceApi.transcribe(audioBlob, voiceLang === 'hi-IN' ? 'hi' : 'en')
          if (resp.text) onTranscript(resp.text)
        } catch (err) {
          console.warn('Fallback Whisper error:', err)
        } finally {
          setIsTranscribing(false)
          setIsRecordingFallback(false)
        }
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecordingFallback(true)
    } catch {
      setIsRecordingFallback(false)
    }
  }

  const stopFallbackRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const toggleVoice = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
        setIsListening(false)
      } else {
        try {
          recognitionRef.current.start()
          setIsListening(true)
        } catch {
          startFallbackRecording()
        }
      }
    } else {
      if (isRecordingFallback) stopFallbackRecording()
      else startFallbackRecording()
    }
  }

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel()
      setSpeakingMsgId(null)
      return
    }
    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*_#`~]/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    const isHindiText = /[\u0900-\u097F]/.test(text)
    utterance.lang = isHindiText ? 'hi-IN' : voiceLang
    utterance.onend = () => setSpeakingMsgId(null)
    utterance.onerror = () => setSpeakingMsgId(null)
    setSpeakingMsgId(msgId)
    window.speechSynthesis.speak(utterance)
  }

  return {
    isListening,
    isRecordingFallback,
    isTranscribing,
    speakingMsgId,
    toggleVoice,
    handleToggleSpeak,
    isMicActive: isListening || isRecordingFallback,
  }
}
