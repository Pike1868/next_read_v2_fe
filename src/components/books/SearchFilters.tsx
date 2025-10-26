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
        <div className="w-full mt-6 md:mt-8">
            <div className="bg-gradient-to-r from-[#14532D] to-[#1a6b3f] border border-green-700 rounded-lg p-4 md:p-6 shadow-md">
                <div className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-6">
                    <div className="flex-1 min-w-0">
                        <label className="block text-sm font-semibold text-white mb-2">
                            Find Your Next Read
                        </label>
                        <Searchbar />
                    </div>
                    <div className="w-full md:w-48 flex-shrink-0">
                        <FormSelect
                            label="Sort By"
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
        </div>
    );
}
