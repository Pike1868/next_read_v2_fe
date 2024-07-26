export default function PromoImage() {
    return (
        <div className="relative w-full bg-center bg-no-repeat bg-cover h-80" style={{ backgroundImage: "url('/NextReadPromo.png')" }}>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
            <div className="text-center text-white">
                <h1 className="text-2xl font-bold">Did someone say...</h1>
                <h2 className="mt-8 text-4xl font-extrabold bg-[#823038]">Weekend </h2>
                <h2 className="mt-2 text-4xl font-extrabold bg-[#823038]">Book Club?</h2>
                <h3 className="mt-8 text-lg">NextRead.Pro</h3>
            </div>
        </div>
    </div>
    );
}
