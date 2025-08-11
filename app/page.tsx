import Link from "next/link";

export default async function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/">
        <h1 className="font-bold text-5xl mb-8">Hey there!</h1>
        <p className="text-xl">
          Welcome to my website, where I do whatever I want, since it&apos;s
          mine!
        </p>
        <br />
        <p className="text-xl">
          It&apos;s probably going to be empty for a while...
        </p>
      </Link>
    </div>
  );
}
