import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
// import { LoadingSpinner } from "../loading-spinner";
// import API from "@/app/lib/api/userAxios";

const CategoryFilter = ({
    categories,
    activeCategory,
    onCategoryChange,
}) => {
    return (
        <div className="flex mb-4 flex-wrap">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 rounded-full min-w-max text-sm cursor-pointer ${activeCategory === category
                        ? "bg-[#0A6C6D] text-white"
                        : "bg-transparent text-gray-700"
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};
const MenuItemCard = ({ type, name, price }) => {
    return (
        <div className="bg-white p-3 rounded-xl border w-full flex flex-col justify-between hover:shadow-md">
            <div>
                <p className="font-semibold uppercase text-xs text-gray-500 mb-2">
                    {type}
                </p>
                <h3 className="font-bold text-gray-800 text-sm">{name}</h3>
            </div>
            <p className="font-semibold text-gray-900 mt-4">
                #{price.toLocaleString()}
            </p>
        </div>
    );
};

export default function RestaurantMenu({ id }) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [itemsToShow, setItemsToShow] = useState(3);
    // const [isLoading, setIsLoading] = useState(false);
    const [menuItems, setMenuItems] = useState();
    const LOAD_MORE_STEP = 3;

    //   const fetchMenus = async () => {
    //     setIsLoading(true);
    //     try {
    //       const response = await API.get(`/vendors/menus?vendorId=${id}`);
    //       const menu = response.data.menus
    //       setMenuItems(menu)
    //     } catch (error) {
    //       console.error(error)
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };
    const fetchMenus = () => {
        setMenuItems([
            { _id: "1", dishName: "Spaghetti Carbonara", category: "Main Course", price: 1200, userId: id },
            { _id: "2", dishName: "Caesar Salad", category: "Appetizer", price: 800, userId: id },
            { _id: "3", dishName: "Tiramisu", category: "Dessert", price: 600, userId: id },
        ])
    }

    useEffect(() => {
        fetchMenus();
    }, []);

    const categories = ["All", "Main Course", "Appetizer", "Dessert", "Drinks"];
    const filteredItems =
        activeCategory === "All"
            ? menuItems
            : menuItems?.filter((item) => item.category === activeCategory);

    const displayedItems = filteredItems?.slice(0, itemsToShow);

    const hasMore = (filteredItems ? filteredItems.length : 0) > itemsToShow;

    const handleShowMore = () => {
        setItemsToShow((prev) =>
            Math.min(prev + LOAD_MORE_STEP, filteredItems ? filteredItems.length : 0)
        );
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setItemsToShow(3);
    };

    return (
        <div className="">
            <div className="w-full">
                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                />
            </div>
            {/* {isLoading ? (
                <div className="h-28 w-full flex flex-col items-center justify-center">

                    <LoadingSpinner />
                    Loading...
                </div>
            ) : ( */}
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
                        {displayedItems && displayedItems.length > 0 ? displayedItems?.map((item) => (
                            <MenuItemCard
                                key={item._id}
                                type={item.category}
                                name={item.dishName}
                                price={item.price}
                            />
                        )) : (
                            <div>Sorry, no available Menu for this Category</div>
                        )}
                    </div>

                    {hasMore && (
                        <div className="mt-8">
                            <button
                                onClick={handleShowMore}
                                className="text-[#0A6C6D] hover:underline text-sm cursor-pointer flex items-center gap-2"
                            >
                                Show more{" "}
                                <ChevronDown
                                    className="
            h-4 w-4"
                                />
                            </button>
                        </div>
                    )}
                </>
            {/* )} */}
        </div>
    );
}
