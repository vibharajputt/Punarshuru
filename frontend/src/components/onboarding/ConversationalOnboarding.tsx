import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ChatHeader from './conversational/ChatHeader'
import ResumeUploadZone from './conversational/ResumeUploadZone'
import ChatMessageBubble from './conversational/ChatMessageBubble'
import ChatInputBar from './conversational/ChatInputBar'
import LiveProfileCard from './conversational/LiveProfileCard'
import ConfirmScreen from './conversational/ConfirmScreen'
import { useOnboardingAgent } from './conversational/useOnboardingAgent'
import { useVoiceAssistant } from './conversational/useVoiceAssistant'

interface ConversationalOnboardingProps {
  onSwitchToForm: () => void
}

export default function ConversationalOnboarding({ onSwitchToForm }: ConversationalOnboardingProps) {
  const { i18n } = useTranslation()
  const [voiceLang, setVoiceLang] = useState<'hi-IN' | 'en-IN'>('en-IN')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    isUploading,
    uploadError,
    isDone,
    isConfirming,
    isFinalizing,
    showConfirmScreen,
    setShowConfirmScreen,
    profileDraft,
    handleSendMessage,
    handleFileUpload,
    handleConfirmAndFinish,
  } = useOnboardingAgent()

  const {
    isMicActive,
    isRecordingFallback,
    isTranscribing,
    speakingMsgId,
    toggleVoice,
    handleToggleSpeak,
  } = useVoiceAssistant({
    voiceLang,
    onTranscript: (text) => setInputMessage((prev) => (prev ? `${prev} ${text}` : text)),
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, isTranscribing])

  const toggleLanguage = () => {
    const next = voiceLang === 'hi-IN' ? 'en-IN' : 'hi-IN'
    setVoiceLang(next)
    i18n.changeLanguage(next === 'hi-IN' ? 'hi' : 'en')
  }

  if (showConfirmScreen) {
    return (
      <ConfirmScreen
        profileDraft={profileDraft}
        onFinish={handleConfirmAndFinish}
        onBackToChat={() => setShowConfirmScreen(false)}
        isFinalizing={isFinalizing}
      />
    )
  }

  return (
    <div className="h-[calc(100vh-6.5rem)] min-h-[600px] flex flex-col space-y-3">
      <ChatHeader
        voiceLang={voiceLang}
        onToggleLang={toggleLanguage}
        onSwitchToForm={onSwitchToForm}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
        <div className="lg:col-span-7 flex flex-col h-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <ResumeUploadZone
            onUpload={handleFileUpload}
            isUploading={isUploading}
            uploadError={uploadError}
          />

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => (
              <ChatMessageBubble
                key={msg.id}
                msg={msg}
                speakingMsgId={speakingMsgId}
                onToggleSpeak={handleToggleSpeak}
                onQuickReply={(text) => {
                  if (text === 'Confirm Profile' || text === 'Confirm & Save Profile') {
                    handleSendMessage('', 'confirm')
                  } else {
                    handleSendMessage(text)
                  }
                }}
                isTyping={isTyping}
                isDone={isDone}
              />
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-9">
                <div className="flex gap-1 items-center bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#0B4F9C] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px]">AI is calibrating...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <ChatInputBar
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSend={(text) => handleSendMessage(text)}
            isTyping={isTyping}
            isMicActive={isMicActive}
            isRecordingFallback={isRecordingFallback}
            voiceLang={voiceLang}
            onToggleVoice={toggleVoice}
          />
        </div>

        <LiveProfileCard
          profileDraft={profileDraft}
          onConfirm={() => handleSendMessage('', 'confirm')}
          isConfirming={isConfirming}
        />
      </div>
    </div>
  )
}
