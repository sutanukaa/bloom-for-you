import { PlantForm } from "@/components/PlantForm";

export default function PlantPage() {
  return (
    <main className="flex-1 flex flex-col items-center px-6 py-14 text-center">
      <h1 className="rise hand text-ink text-4xl sm:text-5xl mb-8">plant a seed</h1>
      <div className="rise rise-1 w-full flex justify-center">
        <PlantForm />
      </div>
    </main>
  );
}
