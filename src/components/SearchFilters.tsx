import FormSelect from "./FormSelect";
import Searchbar from "./Searchbar";

interface SearchFiltersProps {
    sortBooks: (order: string) => void;
}

export default function SearchFilters({ sortBooks }: SearchFiltersProps) {
    return (
        <div className="flex flex-wrap items-center justify-center w-full p-4 mt-4 space-x-10 bg-[#14532D] border-2 border-[#212529] rounded-md border-opacity-20">
            <div className="w-full md:w-auto">
                <Searchbar />
            </div>
            <div className="flex items-center justify-start w-full md:w-auto">
                <div className="flex-shrink-0 w-32 mb-4 md:w-48">
                    <FormSelect
                        label="Sort"
                        name="sort"
                        options={["none", "a-z", "z-a"]}
                        defaultValue={"none"}
                        onChange={sortBooks}
                    />
                </div>
            </div>
        </div>
    );
}
