import { Bot, Code, Sparkles, Zap, BookOpen, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="relative mb-6">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 blur-sm animate-pulse" />
        <div className="relative bg-black p-4 rounded-full">
          <Bot className="h-12 w-12 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-white">Explore Vercel AI SDK with Next.js</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Discover how to integrate AI capabilities into your Next.js applications through interactive examples and code
        snippets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full max-w-2xl">
        <Card className="p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
          <div className="flex items-start space-x-3">
            <div className="bg-purple-900/30 p-2 rounded-lg">
              <Code className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-white mb-1">SDK Fundamentals</h3>
              <p className="text-sm text-gray-400">Learn basic implementation patterns and core concepts</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-900/30 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-white mb-1">Tool Calling</h3>
              <p className="text-sm text-gray-400">See how AI models can invoke functions in your code</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 w-full max-w-2xl">
        <Card className="p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
          <div className="flex items-start space-x-3">
            <div className="bg-green-900/30 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-white mb-1">Model Context Protocol</h3>
              <p className="text-sm text-gray-400">Understand how to manage context and improve responses</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors group cursor-pointer">
          <div className="flex items-start space-x-3">
            <div className="bg-pink-900/30 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-pink-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-white mb-1">Structured Outputs</h3>
              <p className="text-sm text-gray-400">Generate structured data from natural language inputs</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </Card>
      </div>

      <div className="mt-8 text-xs text-gray-500">
        Powered by Frontend Accelerator
      </div>
    </div>
  )
}
