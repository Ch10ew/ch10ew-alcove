import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function Home() {
  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-6xl">
        <Navbar />
        <main className="mt-16 md:mt-0 flex-1 p-4 transition-all duration-300">
          {/* Actual page content - START */}
          <div className="max-w-4xl mx-auto">
            <Link href="/">
              <h1 className="font-bold text-5xl mb-8">Hey there!</h1>
              <p className="text-xl">
                Welcome to my website, where I do whatever I want, since
                it&apos;s mine!
              </p>
              <br />
              <p className="text-xl">
                It&apos;s probably going to be empty for a while...
              </p>
            </Link>
          </div>
          {/* Actual page content - END */}
        </main>
      </div>
    </div>
  );
}
