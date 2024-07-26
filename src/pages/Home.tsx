import CallToActionSection from "@/components/sections/CallToActionSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import GenresSection from "@/components/sections/GenreSection";
import HeroSection from "@/components/sections/HeroSection";
import PromoImage from "@/components/sections/PromoImage";
import TestimonialSection from "@/components/sections/TestimonialsSection";

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <HeroSection />
            <GenresSection />
            <FeaturesSection />
            <PromoImage />
            <TestimonialSection />
            <CallToActionSection />
        </div>
    );
};

export default HomePage;
