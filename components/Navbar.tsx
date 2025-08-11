import Directory from "./Directory";
import { cn } from "@/lib/util";
import TransitionLink from "./TransitionLink";
import { FlameKindling, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <>
      {/* Mobile header with hamburger button */}
      <header className="md:hidden flex items-center bg-background fixed top-0 left-0 right-0 z-20">
        <label
          htmlFor="sidebar-toggle"
          className={cn(
            "m-2 p-3 rounded-md cursor-pointer hover:bg-black/10 dark:hover:bg-white/10",
            "transition-colors duration-300"
          )}
        >
          <Menu size={24} />
        </label>
      </header>

      {/* Sidebar toggle checkbox (hidden) */}
      <input
        type="checkbox"
        id="sidebar-toggle"
        className="hidden peer/sidebar"
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed pt-4 px-4 mt-16 md:mt-0 md:sticky inset-y-0 left-0 w-80 bg-background",
          "transform -translate-x-full md:translate-x-0 transition-transform",
          "duration-300 ease-in-out peer-checked/sidebar:translate-x-0 z-10",
          "h-[calc(100vh-4rem)] md:h-screen flex flex-col scroll-smooth"
        )}
      >
        <div className="flex-shrink-0">
          <TransitionLink href="/">
            <h1 className="font-bold text-3xl mb-4">Ch10ew Alcove</h1>
          </TransitionLink>
        </div>
        <div className="flex-grow overflow-y-auto pr-4">
          <Directory />
          <div className="flex mt-60 w-auto justify-center pr-4 pb-4">
            <FlameKindling />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      <label
        htmlFor="sidebar-toggle"
        className={cn(
          "fixed inset-0 bg-black/50 z-[5] opacity-0 pointer-events-none",
          "peer-checked/sidebar:opacity-100 peer-checked/sidebar:pointer-events-auto",
          "md:hidden transition-opacity duration-300"
        )}
      ></label>
    </>
  );
}
