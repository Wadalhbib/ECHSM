import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  assessment?: SymptomAssessment;
}

interface SymptomAssessment {
  possibleConditions: Array<{
    condition: string;
    confidence: number;
    description: string;
  }>;
  recommendedActions: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  disclaimer: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Health Assistant. I can help you understand your symptoms and provide preliminary health guidance. Please note that I'm not a replacement for professional medical advice. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response - in real app, this would call OpenAI API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAssessment: SymptomAssessment = {
        possibleConditions: [
          {
            condition: 'Common Cold',
            confidence: 75,
            description: 'A viral infection of the upper respiratory tract',
          },
          {
            condition: 'Allergic Rhinitis',
            confidence: 60,
            description: 'An allergic reaction causing nasal symptoms',
          },
        ],
        recommendedActions: [
          'Get plenty of rest',
          'Stay hydrated',
          'Consider over-the-counter medications for symptom relief',
          'Consult a healthcare provider if symptoms worsen or persist',
        ],
        urgencyLevel: 'low',
        disclaimer: 'This assessment is for informational purposes only and should not replace professional medical advice.',
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Based on your symptoms, I've provided an assessment below. Remember, this is preliminary guidance and you should consult with a healthcare professional for proper diagnosis and treatment.",
        timestamp: new Date(),
        assessment: mockAssessment,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'emergency':
        return 'bg-error-100 border-error-300 text-error-800';
      case 'high':
        return 'bg-warning-100 border-warning-300 text-warning-800';
      case 'medium':
        return 'bg-accent-100 border-accent-300 text-accent-800';
      default:
        return 'bg-success-100 border-success-300 text-success-800';
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-full">
            <Bot className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Health Assistant</h3>
            <p className="text-sm text-gray-600">Powered by OpenAI GPT-4</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start space-x-3 max-w-3xl">
                {message.role === 'assistant' && (
                  <div className="p-2 bg-primary-100 rounded-full">
                    <Bot className="h-5 w-5 text-primary-600" />
                  </div>
                )}
                
                <div
                  className={`px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {message.assessment && (
                    <div className="mt-4 space-y-4">
                      {/* Urgency Level */}
                      <div
                        className={`p-3 rounded-lg border ${getUrgencyColor(
                          message.assessment.urgencyLevel
                        )}`}
                      >
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="font-medium">
                            Urgency Level: {message.assessment.urgencyLevel.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Possible Conditions */}
                      <div className="bg-white rounded-lg border p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Possible Conditions:</h4>
                        <div className="space-y-3">
                          {message.assessment.possibleConditions.map((condition, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{condition.condition}</p>
                                <p className="text-sm text-gray-600">{condition.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Confidence</p>
                                <p className="font-bold text-primary-600">{condition.confidence}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Actions */}
                      <div className="bg-white rounded-lg border p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Recommended Actions:</h4>
                        <ul className="space-y-2">
                          {message.assessment.recommendedActions.map((action, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-primary-600 mt-1">•</span>
                              <span className="text-gray-700 text-sm">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Disclaimer */}
                      <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                        <p className="text-sm text-warning-800">
                          <strong>Disclaimer:</strong> {message.assessment.disclaimer}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                
                {message.role === 'user' && (
                  <div className="p-2 bg-gray-100 rounded-full">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary-100 rounded-full">
                <Bot className="h-5 w-5 text-primary-600" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
                  <p className="text-sm text-gray-600">Analyzing your symptoms...</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Describe your symptoms..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          This AI assistant provides preliminary guidance only. Always consult healthcare professionals for medical advice.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;