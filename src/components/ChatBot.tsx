'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Message {
  text: string;
  isUser: boolean;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm Arrel's AI assistant. Ask me anything about Arrel!", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Biography data for the AI to reference
  const arrelInfo = {
    fullName: "Moses Oghenare Iribevbe",
    stageName: "Arrel",
    birthplace: "Ibadan, Oyo State, Nigeria",
    birthday: "August 22 (1990s)",
    occupation: ["singer", "songwriter", "producer", "instrumentalist"],
    genre: ["Afrobeat", "Afrodancehall"],
    education: {
      primary: "Army Children School 2, Lafenwa, Abeokuta",
      secondary: "African Church Grammar School, Abeokuta",
      university: {
        name: "Ladoke Akintola University of Technology (LAUTECH)",
        degree: "B.Tech in Fine and Applied Arts"
      }
    },
    family: {
      father: "Moses Iribevbe (Nigerian Army)",
      mother: "Rhoda Iribevbe (Businessperson)",
      siblings: "One of six siblings, only male child"
    },
    career: {
      earlyBeginnings: {
        band: "Soul Plus (three-member boy band)",
        achievement: "Second runner-up in Star Road Quest"
      },
      label: "Fine Art Music Empire",
      collaborators: ["Ill Blackie", "Twinbeatz", "Spottless", "Jack the Music Nerd", "Olley-RSA"],
      releases: {
        ep: {
          title: "The Fisherman Son (2019)",
          tracks: ["Lagos", "Chanel", "Kimkardashian", "The Fisherman Son", "Girlsthem", "WakaWaka"]
        },
        singles: {
          2024: ["Anita (ft. Olley-RSA)", "Ogologo", "Uthando", "Our Father"],
          2023: ["Pull Up"],
          2022: ["Whyne"],
          2019: ["Ja No (ft. Spotless)", "Marry Me (ft. Byno)"],
          2017: ["Girlsthem"],
          2015: ["Bendova"],
          2012: ["Let's Go"]
        }
      }
    }
  };

  function generateResponse(question: string): string {
    const q = question.toLowerCase();
    
    // Basic information
    if (q.includes('who is') || q.includes('tell me about')) {
      return `${arrelInfo.fullName}, known professionally as ${arrelInfo.stageName}, is a Nigerian ${arrelInfo.occupation.join(", ")}. He was born on ${arrelInfo.birthday} in ${arrelInfo.birthplace} and specializes in ${arrelInfo.genre.join(" and ")} music.`;
    }

    // Family background
    if (q.includes('family') || q.includes('parents') || q.includes('siblings')) {
      return `Arrel comes from a diverse family background. His father, ${arrelInfo.family.father}, served in the Nigerian Army, while his mother, ${arrelInfo.family.mother}, is a businessperson. He is ${arrelInfo.family.siblings}.`;
    }

    // Education
    if (q.includes('education') || q.includes('school') || q.includes('study')) {
      return `Arrel attended ${arrelInfo.education.primary} for primary education and ${arrelInfo.education.secondary} for secondary education. He later earned his ${arrelInfo.education.university.degree} from ${arrelInfo.education.university.name}.`;
    }

    // Music career
    if (q.includes('career') || q.includes('music')) {
      return `Arrel's musical journey began in his early school years with the band ${arrelInfo.career.earlyBeginnings.band}. He gained recognition as ${arrelInfo.career.earlyBeginnings.achievement}. He's now signed to ${arrelInfo.career.label} and has collaborated with notable producers like ${arrelInfo.career.collaborators.join(", ")}.`;
    }

    // Recent releases
    if (q.includes('recent') || q.includes('2024') || q.includes('new') || q.includes('latest')) {
      return `In 2024, Arrel has released several hits including ${arrelInfo.career.releases.singles[2024].join(", ")}.`;
    }

    // EP information
    if (q.includes('ep') || q.includes('album') || q.includes('fisherman')) {
      return `Arrel's debut EP "${arrelInfo.career.releases.ep.title}" features tracks like ${arrelInfo.career.releases.ep.tracks.join(", ")}.`;
    }

    // Collaborations
    if (q.includes('collaborat') || q.includes('feature') || q.includes('worked with')) {
      return `Arrel has collaborated with various artists and producers including ${arrelInfo.career.collaborators.join(", ")}.`;
    }

    // Default response
    return "I'd be happy to tell you about Arrel! You can ask about his background, music career, education, family, recent releases, or collaborations.";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 rounded-lg shadow-xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 text-white'
              }`}
            >
              {message.text}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800 text-white rounded-lg p-3">
              Typing...
            </div>
          </motion.div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about Arrel..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 