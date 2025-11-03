import { menuService } from "@/services/menu.service";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import UniversalLoader from "../ui/LogoLoader";
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
                    key={category.name}
                    onClick={() => onCategoryChange(category.category)}
                    className={`px-4 py-2 rounded-full min-w-max text-sm cursor-pointer ${activeCategory === category.category
                        ? "bg-[#0A6C6D] text-white"
                        : "bg-transparent text-gray-700"
                        }`}
                >
                    {category.name}
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
    const [isLoading, setIsLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]);
    const LOAD_MORE_STEP = 3;

    const fetchMenus = async () => {
        try {
            const menus = await menuService.getMenuItems(id)
            setMenuItems(menus.menuItems)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMenus();
    }, []);

    const categories = [
        {
            name: "All",
            category: "All",
        }, {
            name: "Starters",
            category: "Starters",
        }, {
            name: "Main Course",
            category: "Main Dish ",
        }, {
            name: "Appetizer",
            category: "Appetizer",
        }, {
            name: "Dessert",
            category: "Dessert",
        }, {
            name: "Drinks",
            category: "Drink"
        }];
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

    if (isLoading) return <UniversalLoader />

    return (
        <div className="">
            <div className="w-full">
                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                />
            </div>
            <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
                    {displayedItems && displayedItems.length > 0 ? displayedItems?.map((item) => (
                        <MenuItemCard
                            key={item._id}
                            type={item.category}
                            name={item.name}
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
                                className="h-4 w-4"
                            />
                        </button>
                    </div>
                )}
            </>
            {/* )} */}
        </div>
    );
}
