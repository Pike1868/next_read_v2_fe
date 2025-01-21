type ListSkeletonProps = {
    itemCount?: number; // Number of skeleton items (default: 5)
    titleWidth?: string; // Custom width for the title (default: "w-48")
    itemWidth?: string; // Custom width for each skeleton item (default: "w-32")
    itemHeight?: string; // Custom height for each skeleton item (default: "h-48")
};

export default function ListSkeleton({
    itemCount = 5,
    titleWidth = "w-96",
    itemWidth = "w-64",
    itemHeight = "h-96",
}: ListSkeletonProps) {
    return (
        <div className="mb-4">
            {/* Skeleton Title */}
            <h2
                className={`${titleWidth} h-8 mb-4 text-2xl font-semibold bg-gray-300 dark:bg-gray-700 rounded animate-pulse`}
            ></h2>
            <hr className="my-2" />

            {/* Skeleton Items */}
            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                {Array.from({ length: itemCount }).map((_, idx) => (
                    <div
                        key={idx}
                        className={`${itemWidth} ${itemHeight} bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse`}
                    ></div>
                ))}
            </div>
        </div>
    );
}
