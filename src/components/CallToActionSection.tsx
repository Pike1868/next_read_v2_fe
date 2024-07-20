import { Button } from "./ui/button";
export default function CallToActionSection() {
    return (
        <section className="w-full px-6 py-16 bg-green-900">
            <h2 className="mb-8 text-4xl font-bold text-center text-white">
                Get Started Today
            </h2>
            <p className="mb-8 text-center text-white">
                Join NextRead and start your reading journey now!
            </p>
            <div className="flex justify-center">
                <Button className="mt-6 bg-[#f5cb5c] text-black text-lg hover:bg-yellow-200">
                    Sign Up Now
                </Button>
            </div>
        </section>
    );
}
