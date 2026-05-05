import { Mail, MapPin, Phone, Star } from "lucide-react";
import MapComponent from "@/components/user/ui/mapComponent";
import Images from "@/components/user/ui/Image";
import Images2 from "@/components/user/ui/Image2";
import { useParams } from "react-router";
import Footer from "@/components/Footer";
import ClubInfo from "@/components/user/club/ClubInfo";
import BookingPopup from "@/components/user/club/BookingPopup";
import BookingForm from "@/components/user/club/BookingForm";
import SaveCopy from "@/components/user/ui/SaveCopy";
import Header from "@/components/user/Header";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import StarRating from "@/components/ui/starrating";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import { clubService } from "@/services/club.service";
import { toast } from "react-toastify";
import { TableGridThree } from "@/components/TableGridRecommendations";

const ClubPage = () => {
    const { id } = useParams();
    // const club = ClubsData.data[0];
    const [isLoading, setIsLoading] = useState(true);
    const [tables, setTables] = useState(null)
    const [loading, setLoading] = useState(true);
    const [club, setClub] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchClub = async () => {
            try {
                const res = await userService.getVendor(id)
                setClub(res.data)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        const fetchTables = async () => {
            try {
                const res = await clubService.getTables(id);
                setTables(res.tables)
                setRecommendations(res.recommendations)
                console.log(res)
            } catch (error) {
                console.error(error)
                toast.error("Failed to Fetch Tables!")
            } finally {
                setLoading(false)
            }
        }
        fetchClub();
        fetchTables();
    }, [])

    if (isLoading) return <UniversalLoader fullscreen type="vendor-page" />

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
                                <Images
                                    images={club?.profileImages ?? []}
                                    name={club.businessName}
                                />
                                <Images2
                                    vendor={club}
                                    images={club?.profileImages ?? []}
                                    name={club.businessName}
                                />
                                <div className="space-y-2">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-cente w-full gap-4">
                                        <div className="flex items-center justify-between md:justify-start w-full gap-4 px-4 md:px-0 pt-2 md:pt-0 md:mt-0">
                                            <h1 className="text-2xl text-[#111827] font-semibold truncate max-w-[65%] md:max-w-none">
                                                {club.businessName}{" "}
                                            </h1>{" "}
                                            <span className="px-2 py-0.5 rounded-full border-2 border-[#37703F]  text-xs text-[#37703F]">
                                                {" "}
                                                {club.offer}
                                            </span>
                                        </div>
                                        <SaveCopy type="clubs" id={id} vendor={club} />
                                    </div>
                                    <div className="md:flex hidden gap-1 items-center text-xs">
                                        <StarRating size={16} rating={Number(club.rating)} readOnly />
                                        <span className="font-semibold text-lg">{club.rating}</span>
                                        <span className="text-gray-600">({club.reviews.toLocaleString()} reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <ClubInfo data={club} />
                        </div>
                    </div>
                    <div className="space-y-8 px-4 md:px-0">
                        <div className="p-4 rounded-2xl bg-[#E7F0F0] border border-[#E5E7EB] hidden md:block">
                            <h2 className="text-[#111827] font-semibold text-xl">
                                Reserve your Table
                            </h2>
                            <BookingForm tables={tables} loading={loading} id={id} />
                        </div>
                        <div className="rounded-2xl bg-[#E7F0F0] border border-[#E5E7EB] p-1">
                            <MapComponent address={club.address} />
                        </div>
                        <div className="max-w-sm w-full p-4 rounded-2xl bg-white space-y-4 text-sm text-gray-800">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 text-black mt-1" />
                                    <p>{club.address}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold w-full text-gray-900 mb-1">
                                    Contact Information
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-black mt-1" />
                                    <a href={`tel:${club.phone}`} className="hover:underline">
                                        {club.phone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Mail className="w-5 h-5 text-black mt-1" />
                                    <a href={`mailto:${club.email}`} className="hover:underline">
                                        {club.email}
                                    </a>
                                </div>
                            </div>

                            <div>
                                <a
                                    href="#"
                                    className="text-green-700 font-medium underline hover:text-green-900"
                                >
                                    Club website
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <BookingPopup loading={loading} tables={tables} id={id} />
            </main>
            <div className="hidden md:block">
                <Footer />
            </div>
        </>
    );
};

export default ClubPage;
