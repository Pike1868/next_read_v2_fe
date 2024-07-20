export default function About() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold">About Us</h1>
            <p className="mt-4 text-lg text-center max-w-prose">
                The main objective is to create a platform for both avid readers
                and beginners who aspire to read more. I wanted to build an app
                that allowed users to track their books and see the progress on
                their reading habits, and eventually allow users to create and
                track their reading goals. This app aims to make book discovery
                both easy and personalized by offering book recommendations
                based on a user's favorite genres, authors, and previously read
                books.
            </p>
            <p className="mt-16 text-lg">
                Learn more here:{" "}
                <a
                    className="font-semibold"
                    href="https://github.com/Pike1868/next_read_book_tracker_app"
                >
                    Next Read Github Repo
                </a>
            </p>
        </div>
    );
}
