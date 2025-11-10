import { Bot } from "lucide-react";

export default function SectionLoading() {
    return (
        <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 blur-sm animate-pulse" />
            <div className="relative bg-black p-4 rounded-full">
                <Bot className="h-12 w-12 text-white" />
            </div>
            </div>
    
            <h2 className="text-2xl font-bold mb-2 text-white">Loading...</h2>
        </div>
        </div>
    );
}