import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

    const handleClearFilters = () => {
        dispatch(setSorting("none"));
    };

    return (
        <div className="px-2 py-4 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                <div className="flex-1">
                    <Label htmlFor="sort">Sort By</Label>
                    <Select value={sorting} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="a-z">Title (A-Z)</SelectItem>
                            <SelectItem value="z-a">Title (Z-A)</SelectItem>
                            <SelectItem value="author">Author</SelectItem>
                            <SelectItem value="year">
                                Publication Year
                            </SelectItem>
                            <SelectItem value="page length">
                                Page Count
                            </SelectItem>
                            <SelectItem value="categories">Category</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={handleClearFilters}
                        className="w-full sm:w-auto"
                    >
                        Clear Filters
                    </Button>
                </div>
            </div>
        </div>
    );
}
