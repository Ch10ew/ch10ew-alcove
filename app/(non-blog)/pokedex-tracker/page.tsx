import PokedexTracker from "@/components/PokedexTracker";

export default function PokedexTrackerPage() {
  return (
    <div className="w-7/8 pt-4">
      <h1 className="font-bold text-5xl">Pokedex Tracker</h1>
      <p className="mt-4">
        This tracker automatically saves changes locally. Clearing your site
        data will reset the tracker.{" "}
        <i>
          I&apos;ll update this soon with more features as I see fit as I play
          through the game myself...
        </i>
      </p>
      <br />
      <hr />
      <br />
      <div className="w-full mb-16">
        <PokedexTracker />
      </div>
    </div>
  );
}
