import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState(""); // ✅ Keeps track of the question
    const [showResult, setShowResult] = useState(false); // ✅ Toggles between Greet and Result UI
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const onSent = async () => {
        if (!input.trim()) return;

        setResultData("");
        setLoading(true);
        setShowResult(true); // ✅ Immediately hide greeting cards
        setRecentPrompt(input); // ✅ Store the input before clearing it

        try {
            console.log("Sending prompt:", input);
            const response = await runChat(input);
            console.log("Gemini response:", response);
            
            setResultData(response);
        } catch (error) {
            console.error("Context Error:", error);
            setResultData("An error occurred. Please check your connection.");
        } finally {
            setLoading(false);
            setInput(""); // ✅ Clear the search box
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
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;