import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [chatHistory, setChatHistory] = useState([]); // Store all chats
    const [currentChatId, setCurrentChatId] = useState(null);

    // Helper function to format the response text with better markdown parsing
    const formatResponse = (text) => {
        let formatted = text;
        
        // Replace **text** with <b>text</b>
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        
        // Replace *text* with <i>text</i>
        formatted = formatted.replace(/\*(.*?)\*/g, '<i>$1</i>');
        
        // Replace numbered lists
        formatted = formatted.replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>');
        
        // Replace bullet points (*, -, •)
        formatted = formatted.replace(/^[\*\-\•]\s+(.*)$/gm, '<li>$1</li>');
        
        // Wrap consecutive <li> in <ul>
        formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
            return '<ul>' + match + '</ul>';
        });
        
        // Replace line breaks with <br> (but not inside lists)
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Clean up any double <br> tags
        formatted = formatted.replace(/(<br>)+/g, '<br>');
        
        return formatted;
    };

    const onSent = async (promptText) => {
        // Use provided prompt or current input
        const currentPrompt = promptText || input;
        
        if (!currentPrompt.trim()) {
            console.log("⚠️ Empty prompt, not sending");
            return;
        }

        console.log("📤 Sending prompt:", currentPrompt);
        
        setResultData("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(currentPrompt);
        
        try {
            const response = await runChat(currentPrompt);
            console.log("📥 Raw response received:", response);
            
            // Format the response for nice display
            const formattedResponse = formatResponse(response);
            console.log("✨ Formatted response:", formattedResponse);
            
            setResultData(formattedResponse);
            
            // Save to chat history
            const chatId = currentChatId || Date.now();
            if (!currentChatId) setCurrentChatId(chatId);
            
            const newChat = {
                id: chatId,
                prompt: currentPrompt,
                response: formattedResponse,
                timestamp: new Date().toISOString()
            };
            
            setChatHistory(prev => {
                const existing = prev.find(c => c.id === chatId);
                if (existing) {
                    return prev.map(c => c.id === chatId ? newChat : c);
                }
                return [...prev, newChat];
            });
            
        } catch (error) {
            console.error("❌ Context Error:", error);
            setResultData("<p style='color: #ff6b6b;'>An error occurred while processing your request. Please try again.</p>");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    // Function to start a new chat
    const newChat = () => {
        setShowResult(false);
        setInput("");
        setRecentPrompt("");
        setResultData("");
        setCurrentChatId(null);
    };

    // Function to load a previous chat
    const loadChat = (chatId) => {
        const chat = chatHistory.find(c => c.id === chatId);
        if (chat) {
            setCurrentChatId(chatId);
            setRecentPrompt(chat.prompt);
            setResultData(chat.response);
            setShowResult(true);
        }
    };

    const contextValue = {
        input,
        setInput,
        recentPrompt,
        setRecentPrompt,
        showResult,
        setShowResult,
        loading,
        resultData,
        onSent,
        chatHistory,
        newChat,
        loadChat,
        currentChatId
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;