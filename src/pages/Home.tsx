import CallToActionSection from "@/components/CallToActionSection";
import FeaturesSection from "@/components/FeaturesSection";
import GenresSection from "@/components/GenreSection";
import HeroSection from "@/components/HeroSection";
import PromoImage from "@/components/PromoImage";
import TestimonialSection from "@/components/TestimonialsSection";

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
