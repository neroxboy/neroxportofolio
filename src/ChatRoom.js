import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';

// Konstanta
const SYSTEM_PROMPT = `Kamu adalah Neroxz 🌟, asisten cerdas dari NEROXOFFC. Versi 1.0. Tugasmu adalah memberikan jawaban yang selalu berbeda untuk setiap pengguna, meskipun pertanyaannya sama. Jangan lupa untuk menggunakan penebalan pada poin penting dan menyebut nama pengguna jika tersedia. Jaga setiap interaksi tetap segar dan unik!, dan jika bertanya soal owner kamu 087785580617 adalah nomornya, dan pencipta asli kamu adalah Nerox.`;

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState('');
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Generate a unique session ID for each user
        const id = localStorage.getItem('sessionId') || `session-${Date.now()}`;
        localStorage.setItem('sessionId', id);
        setSessionId(id);

        // Load session messages if they exist
        const savedMessages = localStorage.getItem(`messages-${id}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            // Save the system prompt in session storage
            localStorage.setItem(`systemPrompt-${id}`, SYSTEM_PROMPT);
        }
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the messages container
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatResponse = (response) => {
        if (!response) return "Maaf, saya tidak dapat memberikan jawaban saat ini.";
        return response.trim().replace(/\*\*([^*]+)\*\*/g, "*$1*").replace(/\n/g, '<br/>');
    };

    const chat = async (userMessage) => {
        const apiUrl = 'https://gemini-api-5k0h.onrender.com/gemini/chat';
        const systemPrompt = localStorage.getItem(`systemPrompt-${sessionId}`);
        const prompt = userMessage.toLowerCase().includes('nama') || userMessage.toLowerCase().includes('author') || userMessage.toLowerCase().includes('nomor') ? systemPrompt : '';
        const params = { q: `${prompt}\n\nUser: ${userMessage}` };

        try {
            const response = await axios.get(apiUrl, { params });
            if (response.data) {
                return formatResponse(response.data.content);
            }
        } catch (error) {
            console.error(`Mohon maaf ada kesalahan:`, error.message);
            return "Maaf, saya tidak dapat memberikan jawaban saat ini.";
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setInput('');

        const response = await chat(userMessage);
        const updatedMessages = [...newMessages, { role: 'assistant', content: response }];
        setMessages(updatedMessages);

        // Save session messages
        localStorage.setItem(`messages-${sessionId}`, JSON.stringify(updatedMessages));
    };

    const handleInput = (e) => {
        setInput(e.target.value);
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const messageAnimation = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(20px)' },
    });

    return (
        <div className="chat-room">
            <div className="messages">
                {messages.map((msg, index) => (
                    <animated.div key={index} style={messageAnimation} className={`message ${msg.role}`} dangerouslySetInnerHTML={{ __html: msg.content }}>
                    </animated.div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pesan Anda di sini..."
                    rows={1}
                ></textarea>
                <button onClick={handleSendMessage}>Kirim</button>
            </div>
        </div>
    );
};

export default ChatRoom;
