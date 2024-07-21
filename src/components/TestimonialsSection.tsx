import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
    {
        quote: "NextRead has transformed my reading habits!",
        name: "Luis",
        imgSrc: "/luis.jpg",
    },
    {
        quote: "I love discovering new books every week!",
        name: "Madison",
        imgSrc: "/madison.jpg",
    },
    {
        quote: "The recommendations are always spot on. I can't put the books down!",
        name: "Emily",
        imgSrc: "/emily.jpg",
    },
    {
        quote: "NextRead has made finding new books so easy and enjoyable.",
        name: "John",
        imgSrc: "/john.jpg",
    },
];

export default function TestimonialSection() {
    return (
        <section className="w-full px-6 py-16">
            <h2 className="mb-8 text-4xl font-bold text-center">
                What Our Users Are Saying...
            </h2>
            <div className="px-3 mx-auto lg:max-w-6xl">
                <Carousel>
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => (
                            <CarouselItem
                                key={index}
                                className="md:basis-1/2 lg:basis-1/3"
                            >
                                <Card className="shadow-sm">
                                    <CardContent className="flex items-center justify-center p-6 aspect-square">
                                        <div className="flex flex-col px-4 py-5 sm:p-6">
                                            <q className="flex-1 text-lg text-gray-800 dark:text-gray-300">
                                                {testimonial.quote}
                                            </q>
                                            <div className="flex items-center justify-center gap-3 mt-6">
                                                <span className="inline-flex rounded-full">
                                                    <img
                                                        className="w-20 h-20 rounded-full"
                                                        height={60}
                                                        width={60}
                                                        alt={testimonial.name}
                                                        src={testimonial.imgSrc}
                                                        loading="lazy"
                                                    />
                                                </span>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {testimonial.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-black" />
                    <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-black" />
                </Carousel>
            </div>
        </section>
    );
}
