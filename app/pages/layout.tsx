import Navbar from "@/components/Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-6xl">
        <Navbar />
        <main className="mt-16 md:mt-0 flex-1 p-4 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
