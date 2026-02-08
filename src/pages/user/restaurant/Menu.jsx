import Header from "@/components/user/Header";
import BookingForm from "@/components/user/restaurant/BookingForm";
import BookingPopup from "@/components/user/restaurant/BookingPopup";
import RestaurantSaveCopy from "@/components/user/ui/SaveCopy";
import RestaurantImages2 from "@/components/user/ui/Image2";
import RestaurantImages from "@/components/user/ui/Image";
import RestaurantInfo from "@/components/user/restaurant/RestaurantInfo";
import MapComponent from "@/components/user/ui/mapComponent";
import { Mail, MapPin, Phone, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router";
// import { RestaurantData } from "@/lib/api";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import StarRating from "@/components/ui/starrating";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import Footer from "@/components/Footer";

const MenuPage = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [restaurant, setRestaurant] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await userService.getOffers(id)
                console.log(res)
                setRestaurant({ ...res.data, selected: res.data.items.map(item => ({ ...item, quantity: 1 })) })

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
                                    <div className="absolute top-[20px] px-[16px] z-40 w-full flex md:hidden justify-between items-center">
                                        <button
                                            className="size-10 rounded-xl bg-white text-black hover:bg-gray-50 flex justify-center border border-[#E5E7EB] items-center gap-2"
                                            onClick={() => {
                                                navigate("/");
                                            }}
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g clipPath="url(#clip0_2317_1082)">
                                                    <path
                                                        d="M3.03 9.41084C2.87377 9.56711 2.78601 9.77903 2.78601 10C2.78601 10.221 2.87377 10.4329 3.03 10.5892L7.74417 15.3033C7.90133 15.4551 8.11184 15.5391 8.33033 15.5372C8.54883 15.5353 8.75784 15.4477 8.91235 15.2932C9.06685 15.1387 9.1545 14.9297 9.15639 14.7112C9.15829 14.4927 9.0743 14.2822 8.9225 14.125L5.63083 10.8333H16.6667C16.8877 10.8333 17.0996 10.7455 17.2559 10.5893C17.4122 10.433 17.5 10.221 17.5 10C17.5 9.77899 17.4122 9.56703 17.2559 9.41075C17.0996 9.25447 16.8877 9.16667 16.6667 9.16667H5.63083L8.9225 5.875C9.0743 5.71783 9.15829 5.50733 9.15639 5.28883C9.1545 5.07034 9.06685 4.86133 8.91235 4.70682C8.75784 4.55231 8.54883 4.46467 8.33033 4.46277C8.11184 4.46087 7.90133 4.54487 7.74417 4.69667L3.03 9.41084Z"
                                                        fill="#111827"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2317_1082">
                                                        <rect width="20" height="20" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                className="size-10 rounded-xl bg-white text-black hover:bg-gray-50 flex justify-center border border-[#E5E7EB] items-center gap-2"
                                            >
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g clipPath="url(#clip0_2317_1068)">
                                                        <path
                                                            d="M7.5 2.5C7.7124 2.50024 7.91669 2.58157 8.07114 2.72737C8.22559 2.87318 8.31853 3.07246 8.33098 3.2845C8.34342 3.49653 8.27444 3.70532 8.13811 3.86819C8.00179 4.03107 7.80841 4.13575 7.5975 4.16083L7.5 4.16667H4.16667V15.8333H15.8333V8.33333C15.8336 8.12093 15.9149 7.91664 16.0607 7.76219C16.2065 7.60775 16.4058 7.5148 16.6178 7.50236C16.8299 7.48991 17.0386 7.5589 17.2015 7.69522C17.3644 7.83155 17.4691 8.02492 17.4942 8.23583L17.5 8.33333V15.8333C17.5001 16.2538 17.3413 16.6588 17.0554 16.9671C16.7695 17.2754 16.3776 17.4643 15.9583 17.4958L15.8333 17.5H4.16667C3.74619 17.5001 3.34119 17.3413 3.03288 17.0554C2.72456 16.7695 2.5357 16.3776 2.50417 15.9583L2.5 15.8333V4.16667C2.49987 3.74619 2.65867 3.34119 2.94458 3.03288C3.23049 2.72456 3.62237 2.5357 4.04167 2.50417L4.16667 2.5H7.5ZM16.2608 2.5C16.7792 2.5 17.0808 2.89 17.1567 3.21333C17.2325 3.5375 17.1358 4.0225 16.6692 4.2525L16.3242 4.42833L16.1875 4.50167L15.885 4.66917L15.5475 4.86583L15.1817 5.09083C14.6133 5.44917 13.965 5.90417 13.3133 6.455C11.935 7.62083 10.5983 9.1725 9.9575 11.0967C9.88766 11.3064 9.73736 11.4798 9.53967 11.5787C9.34197 11.6777 9.11308 11.694 8.90333 11.6242C8.69359 11.5543 8.52018 11.404 8.42126 11.2063C8.32233 11.0086 8.30599 10.7797 8.37583 10.57C9.14917 8.25 10.7283 6.45917 12.2375 5.1825C12.5967 4.87833 12.9558 4.60083 13.3025 4.34917L13.5608 4.16667H11.6667C11.4543 4.16643 11.25 4.0851 11.0955 3.93929C10.9411 3.79349 10.8481 3.59421 10.8357 3.38217C10.8232 3.17014 10.8922 2.96135 11.0286 2.79847C11.1649 2.6356 11.3583 2.53092 11.5692 2.50583L11.6667 2.5H16.2608Z"
                                                            fill="#111827"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2317_1068">
                                                            <rect width="20" height="20" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </button>
                                            <button
                                                className="size-10 rounded-xl bg-white text-black hover:bg-gray-50 flex justify-center border border-[#E5E7EB] items-center gap-2"
                                            >
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g clipPath="url(#clip0_2317_1077)">
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M15.4117 3.1675C17.1575 4.185 18.3858 6.25083 18.3317 8.66083C18.2642 11.6692 15.9233 14.3225 11.9325 16.6925C11.3408 17.0442 10.7175 17.5 10 17.5C9.29585 17.5 8.64585 17.0358 8.06668 16.6917C4.07752 14.3225 1.73585 11.6683 1.66835 8.66083C1.61418 6.25083 2.84252 4.18583 4.58835 3.1675C6.22168 2.21666 8.27335 2.21083 10 3.615C11.7267 2.21083 13.7783 2.21583 15.4117 3.1675ZM14.5725 4.60833C13.4108 3.93166 11.9592 3.95583 10.7025 5.2275C10.6105 5.32017 10.5011 5.39372 10.3805 5.44391C10.2599 5.4941 10.1306 5.51993 10 5.51993C9.86942 5.51993 9.74011 5.4941 9.61955 5.44391C9.49898 5.39372 9.38953 5.32017 9.29752 5.2275C8.04085 3.95583 6.58918 3.93166 5.42752 4.60833C4.22418 5.31 3.29418 6.79833 3.33502 8.625C3.38168 10.7175 5.03502 12.9533 8.91835 15.26C9.25835 15.4625 9.61335 15.7217 10 15.8292C10.3867 15.7217 10.7417 15.4625 11.0817 15.26C14.965 12.9533 16.6183 10.7183 16.665 8.62416C16.7067 6.79916 15.7758 5.31 14.5725 4.60833Z"
                                                            fill="#111827"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2317_1077">
                                                            <rect width="20" height="20" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
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
                <BookingPopup id={id} menu={true} reservation={restaurant} />
            </main>
            <div className="hidden md:block">
                <Footer />
            </div>
        </>
    );
};

export default MenuPage;