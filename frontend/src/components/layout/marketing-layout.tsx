import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ChatBot } from "@/components/common/chatbot";

/** Public site chrome: navbar + footer + floating assistant. */
export default function MarketingLayout() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
