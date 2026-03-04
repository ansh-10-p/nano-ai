import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]); // multi-turn messages
    const [attachedImage, setAttachedImage] = useState(null); // { file, url }

    const formatResponse = (text) => {
        let formatted = text;
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        formatted = formatted.replace(/\*(.*?)\*/g, '<i>$1</i>');
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        formatted = formatted.replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/^[\*\-\•]\s+(.*)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, (match) => '<ul>' + match + '</ul>');
        formatted = formatted.replace(/\n\n/g, '</p><p>');
        formatted = formatted.replace(/\n/g, '<br>');
        return formatted;
    };

    const onSent = async (promptText) => {
        const currentPrompt = promptText || input;
        if (!currentPrompt.trim()) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: currentPrompt,
            image: attachedImage?.url || null,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setResultData("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(currentPrompt);
        setInput("");
        setAttachedImage(null);

        try {
            const response = await runChat(currentPrompt);
            const formattedResponse = formatResponse(response);

            const aiMessage = {
                id: Date.now() + 1,
                role: 'ai',
                content: formattedResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
            setResultData(formattedResponse);

            const chatId = currentChatId || Date.now();
            if (!currentChatId) setCurrentChatId(chatId);

            const newChatEntry = {
                id: chatId,
                prompt: currentPrompt,
                response: formattedResponse,
                timestamp: new Date().toISOString()
            };

            setChatHistory(prev => {
                const existing = prev.find(c => c.id === chatId);
                if (existing) return prev.map(c => c.id === chatId ? newChatEntry : c);
                return [...prev, newChatEntry];
            });

        } catch (error) {
            console.error("Context Error:", error);
            const errorMessage = {
                id: Date.now() + 1,
                role: 'ai',
                content: "<span style='color:#ff6b6b'>Something went wrong. Please try again.</span>",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            setResultData(errorMessage.content);
        } finally {
            setLoading(false);
        }
    };

    const newChat = () => {
        setShowResult(false);
        setInput("");
        setRecentPrompt("");
        setResultData("");
        setCurrentChatId(null);
        setMessages([]);
        setAttachedImage(null);
    };

    const loadChat = (chatId) => {
        const chat = chatHistory.find(c => c.id === chatId);
        if (chat) {
            setCurrentChatId(chatId);
            setRecentPrompt(chat.prompt);
            setResultData(chat.response);
            setShowResult(true);
            setMessages([
                { id: 1, role: 'user', content: chat.prompt, timestamp: new Date(chat.timestamp) },
                { id: 2, role: 'ai', content: chat.response, timestamp: new Date(chat.timestamp) }
            ]);
        }
    };

    const contextValue = {
        input, setInput,
        recentPrompt, setRecentPrompt,
        showResult, setShowResult,
        loading, resultData,
        onSent,
        chatHistory, newChat, loadChat, currentChatId,
        messages, setMessages,
        attachedImage, setAttachedImage,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;