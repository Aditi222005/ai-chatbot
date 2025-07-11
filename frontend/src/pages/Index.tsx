
import ChatBot from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <div className="container mx-auto p-4 h-screen max-w-4xl">
        <div className="h-full bg-white rounded-xl shadow-xl overflow-hidden">
          <ChatBot 
            title="AI Assistant" 
            placeholder="Ask me anything..."
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
