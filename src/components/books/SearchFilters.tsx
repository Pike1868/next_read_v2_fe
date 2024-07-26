import FormSelect from "@/components/books/FormSelect";
import Searchbar from "@/components/books/Searchbar";
import { setSorting } from "@/features/search/searchSlice";
import { RootState } from "@/store/rootReducer";
import { BookFilterOptions } from "@/types/books";
import { useDispatch, useSelector } from "react-redux";

export default function SearchFilters() {
    const sorting = useSelector((state: RootState) => state.search.sorting);
    const dispatch = useDispatch();

    const handleSortChange = (value: BookFilterOptions) => {
        dispatch(setSorting(value));
    };

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
                        value={sorting}
                        options={[
                            "none",
                            "a-z",
                            "z-a",
                            "author",
                            "year",
                            "page length",
                            "categories",
                        ]}
                        onChange={handleSortChange}
                    />
                </div>
            </div>
        </div>
    );
}
