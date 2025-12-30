import Header from "@/components/user/Header";
import BookingForm from "@/components/user/restaurant/BookingForm";
import BookingPopup from "@/components/user/restaurant/BookingPopup";
import RestaurantSaveCopy from "@/components/user/ui/SaveCopy";
import RestaurantImages2 from "@/components/user/ui/Image2";
import RestaurantImages from "@/components/user/ui/Image";
import RestaurantInfo from "@/components/user/restaurant/RestaurantInfo";
import MapComponent from "@/components/user/ui/mapComponent";
import { Mail, MapPin, Phone, Star } from "lucide-react";
import { useParams } from "react-router";
// import { RestaurantData } from "@/lib/api";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import StarRating from "@/components/ui/starrating";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import Footer from "@/components/Footer";

const MenuPage = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [restaurant, setRestaurant] = useState({
        _id: "",
        businessName: "",
        address: "",
        phone: "",
        email: "",
        profileImages: [""],
        rating: 0,
        reviews: 256,
        cuisine: "",
        openingHours: "",
        priceRange: "",
        amenities: [""],
        menu: [
            {
                name: "",
                description:
                    "",
            },
        ],
        openingTime: "",
        closingTime: "",
        cuisines: [""],
        businessDescription:
            "",
        availableSlots: [""],
        selected: [],
    })

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await userService.getOffers(id)
                console.log(res)
                setRestaurant({...res.data, selected: res.data.items.map(item => ({...item, quantity: 1}))})

            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchRestaurant();
    }, [])

    if (isLoading) return <UniversalLoader fullscreen />

    return (
        <>
            <div className="hidden md:block">
                <Header />
            </div>
            <main className="mx-auto md:mt-[85px] mb-[160px] md:mb-[16px] md:py-8 max-w-7xl md:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8 w-full">
                    <div className="w-full space-y-4 md:space-y-8">
                        <div className="col-span-2">
                            <div className="w-full space-y-6">
                                <div className="w-full overflow-clip h-[270px] relative">
                                    <div className="w-full h-full relative overflow-hidden md:rounded-2xl   ">
                                        <img
                                            src={restaurant.coverImage}
                                            alt={`${restaurant.name} Image`}
                                            className="object-cover transition-opacity duration-700 size-full"
                                            style={{ opacity: 1 }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-cente w-full gap-4">
                                        <div className="flex gap-2 items-center pt-2 md:pt-0 px-4 md:px-0">
                                            <h1 className="text-2xl text-[#111827] font-semibold">
                                                {restaurant.name}{" "}
                                            </h1>{" "}
                                            <span className="px-2 py-0.5 rounded-full border border-black bg-[#D1FAE5]">
                                                {" "}
                                                {restaurant.vendor.businessName}
                                            </span>
                                        </div>
                                        <RestaurantSaveCopy id={id} menu={true} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            {/* <RestaurantInfo data={restaurant} /> */}
                        </div>
                    </div>
                    <div className="space-y-8 px-4 md:px-0">
                        <div className="p-4 rounded-2xl bg-[#E7F0F0] border w-full border-[#E5E7EB] hidden md:block">
                            <h2 className="text-[#111827] font-semibold text-xl">
                                Reserve your Table
                            </h2>
                            <BookingForm id={id} menu={true} reservation={restaurant} />
                        </div>
                        <div className="rounded-2xl bg-[#E7F0F0] border border-[#E5E7EB] p-1">
                            <MapComponent address={restaurant.vendor.address} />
                        </div>
                        <div className="max-w-sm w-full p-4 rounded-2xl bg-white space-y-4 text-sm text-gray-800">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 text-black mt-1" />
                                    <p>{restaurant.vendor.address}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold w-full text-gray-900 mb-1">
                                    Contact Information
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-black mt-1" />
                                    <a href={`tel:${restaurant.vendor.phone}`} className="hover:underline">
                                        {restaurant.vendor.phone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Mail className="w-5 h-5 text-black mt-1" />
                                    <a
                                        href={`mailto:${restaurant.vendor.email}`}
                                        className="hover:underline"
                                    >
                                        {restaurant.vendor.email}
                                    </a>
                                </div>
                            </div>

                            <div>
                                <a
                                    href="#"
                                    className="text-green-700 font-medium underline hover:text-green-900"
                                >
                                    Restaurant website
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <BookingPopup id={id} />
            </main>
            <div className="hidden md:block">
                <Footer />
            </div>
        </>
    );
};

export default MenuPage;