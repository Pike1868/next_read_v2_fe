import { Card, CardContent } from "./ui/card";

export default function GenresSection() {
    const TOP_GENRES = [
        {
            name: "Romance",
            imgSrc: "/romance.jpg",
        },
        {
            name: "Dystopian",
            imgSrc: "/dystopian.jpg",
        },
        {
            name: "Mystery",
            imgSrc: "/mystery.jpg",
        },
        {
            name: "Fantasy",
            imgSrc: "/fantasy.jpg",
        },
        {
            name: "Science Fiction",
            imgSrc: "/science-fiction.jpg",
        },
        {
            name: "Thriller",
            imgSrc: "/thriller.jpg",
        },
    ];

    return (
        <section className="w-full px-6 py-20 bg-white">
            <h2 className="mb-8 text-4xl font-bold text-center">
                Find Your Next Read By Genre
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
                {TOP_GENRES.map((genre, index) => (
                    <Card
                        key={index}
                        className="w-full max-w-sm p-0 overflow-hidden transition-transform duration-200 transform rounded-lg shadow-md hover:scale-105"
                    >
                        <img
                            src={genre.imgSrc}
                            alt={genre.name}
                            className="object-cover w-full h-48 rounded-t-lg"
                        />
                        <CardContent className="h-full p-4 text-center bg-white ">
                            <h3 className="ml-4 text-xl font-semibold ">
                                {genre.name}
                            </h3>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
