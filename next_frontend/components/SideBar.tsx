import { Home, MessageCircle, User, Settings, ChevronRight } from "lucide-react"; // Importing Lucide icons

export default function Sidebar() {
  return (
    <div className="h-full mr-[20px] w-[70px] fixed top-0 left-0 flex flex-col justify-between items-center text-white pt-16 pb-4 bg-gray-800 z-10">
      <div className="hover:text-green-500 py-8">
        <Home className="text-2xl" />
      </div>
      <div className="hover:text-green-500">
        <MessageCircle className="text-2xl" />
      </div>
      <div className="hover:text-green-500">
        <User className="text-2xl" />
      </div>
      <div className="hover:text-green-500">
        <Settings className="text-2xl" />
      </div>
      <div className="hover:text-green-500 py-8">
        <ChevronRight className="text-2xl" />
      </div>
    </div>
  );
}