import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./chatbot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gemini");
  const chatEndRef = useRef(null);

  const API_URL =
    process.env.REACT_APP_API_URL;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(API_URL, {
        message: input,
        model: model,
      });

      const botMessage = { from: "ai", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Sorry, something went wrong!!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

 return (
  <>
    <div className="top-heading">🤖 AI Chat Assistant</div>

    <div className='chat-container'>
      <div className='chat-header'>
        <h2>Consult Assistant...</h2>
        <div className='model-selector'>
          <label htmlFor='model'>Model :</label>
          <select
            id='model'
            value={model}
            onChange={(e) => setModel(e.target.value)}>
            <option value='gemini'>🌸 Gemini</option>
            <option value='ollama'>🐙 Ollama</option>
            <option value='openrouter'>🚀 OpenRouter</option>
            <option value='groq'>⚡ Groq</option>
          </select>
        </div>
      </div>

      <div className='chat-box'>
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              className={`message ${msg.from}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}>
              <strong>{msg.from === "user" ? "👤 You" : "⚡ Bot"}:</strong>{" "}
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            className='message ai'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}>
            <strong>🤖 Bot:</strong>
            <span className='loader-dots'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
            </span>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form
        className='chat-input-form'
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}>
        <input
          className='chat-input'
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type your message...'
        />
        <button
          className='chat-send-btn'
          type='submit'
          disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  </>
);

};

export default ChatBot;
