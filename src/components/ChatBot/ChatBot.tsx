'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Arrel's AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Simple response generation (replace with actual AI integration)
  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Latest Events and News
    if (input.includes('latest') || input.includes('news') || input.includes('update')) {
      return "Big news! 🎉 I just released my new album 'Desert Melodies' and kicked off my World Tour 2024! I'm also hosting a special live streaming concert next week where I'll perform unreleased tracks. Have you gotten your virtual tickets yet? 🎫✨";
    }

    // Upcoming Events
    if (input.includes('event') || input.includes('upcoming')) {
      return "Here's what's coming up! 📅 This weekend I'm performing at the African Music Festival in Lagos, next week I'll be in London for a special collaboration concert with the LSO, and I'm hosting my monthly fan meetup in Paris on the 25th. Which event are you planning to attend? 🎪🌍";
    }

    // Tour Information
    if (input.includes('tour') || input.includes('concert') || input.includes('show')) {
      return "The Desert Melodies World Tour 2024 is my biggest yet! 🌍 We're bringing traditional African instruments, a full electronic setup, and amazing visuals to 30 cities. Next stops: Lagos (March 15), London (March 20), Paris (March 25). VIP packages include a personal meet & greet and an exclusive acoustic session! Check the tour page for tickets. Which city will I see you in? 🎫✨";
    }

    // Latest Album
    if (input.includes('album') || input.includes('desert melodies')) {
      return "'Desert Melodies' is my most personal album yet! Released March 1st, 2024, it features 12 tracks including the hit singles 'Sahara Nights' and 'African Electronic Soul'. The album blends traditional kora melodies with modern electronic beats. The deluxe version includes behind-the-scenes footage of the recording process in Senegal. Have you heard the track 'Moonlight in Dakar'? It's getting amazing fan reactions! 🎧🌟";
    }

    // Specific Songs
    if (input.includes('sahara nights')) {
      return "'Sahara Nights' is the lead single from 'Desert Melodies'. I wrote it during a magical night in the Sahara Desert, blending the sounds of traditional Gnawa music with electronic beats. The music video was filmed in the desert at sunrise - have you seen it yet? It just hit 1 million views! 🎥✨";
    }

    if (input.includes('moonlight in dakar')) {
      return "'Moonlight in Dakar' is a special collaboration with Senegalese musicians. We recorded it live in Dakar using traditional instruments. The song tells the story of my first night in Senegal when I fell in love with African music. Many fans say it's their favorite track - what do you think about the drum solo in the middle? 🥁✨";
    }

    // Live Performances
    if (input.includes('live') || input.includes('performance')) {
      return "My live shows are a unique experience! I perform with both traditional African instruments and electronic equipment. Each show features special guests from the local music scene. At my last show in Paris, we had an amazing jam session with local jazz musicians. Did you catch any of my recent performances? 🎪🎵";
    }

    // Music Journey
    if (input.includes('journey') || input.includes('story') || input.includes('background')) {
      return "My musical journey started in Morocco, where I learned traditional instruments. Then I studied electronic music in Paris, which inspired me to blend these worlds together. The turning point was my year in Senegal, learning from master musicians. Now, I'm on a mission to share this fusion of sounds with the world. What part of my journey interests you most? 🌍🎵";
    }

    // Fan Meetups
    if (input.includes('meet') || input.includes('meetup') || input.includes('fan meeting')) {
      return "I love meeting my fans! 🤝 I host monthly fan meetups in different cities - they're intimate gatherings where we share stories, play music together, and I sometimes preview new songs. The next one is in Paris on March 25th, right after my concert. Will you be joining us? Limited spots available on the booking page! 🎵💫";
    }

    // Collaborations
    if (input.includes('collab') || input.includes('collaboration')) {
      return "I'm currently working on exciting collaborations! 🤝 Just finished recording with the London Symphony Orchestra for a special edition of 'Desert Melodies', and next month I'm heading to Lagos to work with Burna Boy. I believe in bringing different musical worlds together. Which collaboration are you most excited about? 🎵✨";
    }

    // Music Production
    if (input.includes('produce') || input.includes('production') || input.includes('studio')) {
      return "I produce all my music in my custom studio that combines traditional African instruments with modern technology. For 'Desert Melodies', we recorded live instruments in Senegal, then I added electronic elements in my Paris studio. I'm actually hosting a production masterclass next month! Interested in learning my techniques? 🎹🎛️";
    }

    // Merchandise and Special Editions
    if (input.includes('merch') || input.includes('merchandise') || input.includes('special edition')) {
      return "Just launched the 'Desert Melodies' collection! 🛍️ It includes limited edition vinyl with exclusive tracks, hand-made djembe drums, and traditional-inspired fashion pieces. The special box set includes a signed kora string and behind-the-scenes footage. Have you seen the new glow-in-the-dark desert design shirts? They're almost sold out! 👕✨";
    }

    // Tickets and VIP Experiences
    if (input.includes('ticket') || input.includes('vip') || input.includes('booking')) {
      return "VIP packages for the World Tour include: exclusive pre-show acoustic performance, traditional instrument workshop with me, signed merchandise, and premium seating! 🎫 For the upcoming London show, VIP members will also join a special recording session at Abbey Road Studios. Interested in the VIP experience? 🌟";
    }

    // Music Workshops
    if (input.includes('workshop') || input.includes('learn') || input.includes('teach')) {
      return "I'm passionate about sharing my musical knowledge! 🎹 My workshops combine traditional African music with modern production techniques. Next month, I'm hosting a special 3-day workshop in Paris where we'll explore kora playing, electronic music production, and fusion arrangements. Would you like to join? Limited spots available! 📚🎵";
    }

    // Greetings
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! 👋 Thanks for connecting! I'm excited to share my musical journey with you. I just got back from an amazing show in Marrakech - the energy was incredible! What would you like to know about my music, tours, or upcoming events? 🎵✨";
    }

    // Fan Appreciation
    if (input.includes('love your music') || input.includes('amazing') || input.includes('fantastic')) {
      return "Thank you so much! 🙏 Your support means everything to me. Every time I perform, I feel the amazing energy from fans like you. Would you like to join our fan club? Members get exclusive access to unreleased tracks and private listening sessions! 💫🎵";
    }

    // Default responses focused on current events and music
    const defaultResponses = [
      "I'm currently preparing for my next show! Want to hear about the special surprises we have planned? 🎪✨",
      "Just finished rehearsing with my band for the upcoming tour. We're adding some exciting new arrangements to the classic tracks. Would you like to know more? 🎵🎸",
      "I'm in the studio working on some new material! Can't wait to share it with amazing fans like you. What kind of sounds would you love to hear in my next release? 🎧🌟",
      "Between shows on the Desert Melodies Tour! Each city brings new energy and inspiration. Have you caught any of the shows yet? 🌍🎪"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 rounded-lg overflow-hidden">
      <div className="bg-black/50 p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Chat with Arrel's AI</h2>
        <p className="text-gray-400 text-sm">Get instant responses to your questions</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 text-white'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black rounded-full px-6 py-2 font-semibold hover:bg-yellow-300 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 