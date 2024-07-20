import { FaSearch } from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Searchbar() {
    return (
        <div className="flex justify-center w-full py-4 ">
            <div className="flex max-h-20">
                <Input
                    className="p-2 px-4 py-2 text-black rounded-l-full"
                    placeholder="Search for books here..."
                />
                <Button className="flex items-center px-4 py-2 text-white bg-green-800 rounded-r-full hover:bg-green-500">
                    <FaSearch className="mr-2" />
                    Search
                </Button>
            </div>
        </div>
    );
}
