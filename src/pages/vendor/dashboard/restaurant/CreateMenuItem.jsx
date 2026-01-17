import DashboardButton from '@/components/dashboard/ui/DashboardButton'
import { Cash2, Delete2, DishCover, DragDrop } from '@/components/dashboard/ui/svg';
import Header2 from '@/components/layout/headers/vendor_header2'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import UniversalLoader from '@/components/user/ui/LogoLoader';
import { menuService } from '@/services/menu.service';
import axios from 'axios';
import { Check, CheckCircle, DownloadCloud, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const CreateMenu = () => {
    const [step, setStep] = useState(0);
    const vendor = useSelector((state) => state.auth.vendor);
    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        category: "",
        price: 0,
        tags: [],
        mealTimes: [],
        discount: true,
        discountPrice: 0,
        coverImage: "",
        addOns: false,
        assignedMenu: "",
        isVisible: true,
    })
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const navigate = useNavigate();
    const initialTags = ["Spicy", "Popular", "Savory"];
    const [tags, setTags] = useState(initialTags);
    const [newTag, setNewTag] = useState("");
    const [menus, setMenus] = useState([])
    const [createItem, setCreateItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [uploadLoading, setUploadLoading] = useState(false);

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    const toggleTag = (t) => {
        setNewItem((prev) => ({
            ...prev, tags:
                prev.tags.includes(t) ? prev.tags.filter((x) => x !== t) : [...prev.tags, t]
        }));
    };


    const addTag = () => {
        if (!newTag.trim()) return;
        if (!tags.includes(newTag.trim())) {
            setTags((t) => [...t, newTag.trim()]);
        }
        setNewTag("");
    };

    const handleCreateNewMenu = () => {
        setSuccessModal(false)
    }

    const handleNext = async () => {
        try {
            setLoading(true)
            if (
                newItem.name &&
                newItem.category.length > 0 &&
                newItem.tags.length > 0 &&
                newItem.price > 0
            ) {
                const createdItem = await menuService.createMenuItem({
                    ...newItem,
                });
                setCreateItem(createdItem);
                toast.success("Menu item created and added to menu");
                setSuccessModal(true);
                setNewItem({
                    name: "",
                    description: "",
                    category: "",
                    price: 0,
                    tags: [],
                    mealTimes: [],
                    discount: true,
                    discountPrice: 0,
                    addOns: false,
                    coverImage: "",
                    assignedMenus: [],
                    isVisible: true,
                });
            }
        } catch (error) {
            console.error(error)
            toast.error("Error creating Menu Item")
        } finally {
            setLoading(false)
        }
    };


    const handleImageUpload = useCallback(
        async (files, setImage) => {
            setUploadLoading(true)
            const file = files[0];
            if (file.size > 5242880) {
                alert("File size exceeds 5MB limit.");
                return;
            }

            const fileName = file.name

            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', UPLOAD_PRESET)

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                    formData,
                )

                const imageUrl = response.data.secure_url
                setImage((prev) => ({ ...prev, coverImage: imageUrl }))
            } catch (error) {
                console.error('Upload failed for', fileName, error)
            } finally {
                setUploadLoading(false)
            }
        },
        [newItem.images]
    )

    const handleCancel = () => {
        if (step === 0) {
            navigate(-1)
        } else {
            setStep(prev => prev - 1)
        }
    }

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await menuService.getMenus(vendor._id)
                console.log(res)
                setMenus(res.menus)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMenus()
    }, [])

    if (isLoading) return <UniversalLoader fullscreen />


    return (
        <div className='bg-[#F9FAFB] min-h-dvh pb-16'>
            <Header2 title="Create Menu Item" />
            <div className=' flex'>
                <div className='md:p-6 space-y-[45px] flex-1'>
                    <div className='max-w-[1300px] w-full mx-auto'>
                        <div className='grid gap-6 lg:grid-cols-2'>
                            <div className='space-y-6'>
                                <div className='px-5 py-6 bg-white rounded-2xl border border-[#E5E7EB] w-full space-y-4'>
                                    <h2 className='text-[#111827] font-medium text-sm'>
                                        Basic Information
                                    </h2>
                                    <div className='space-y-5'>
                                        <div className="space-y-2">
                                            <Label className=" text-xs" htmlFor="menuName">Menu Item name <span className='text-[#EF4444]'>*</span></Label>
                                            <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} id="menuName" placeholder="e.g Joe's Platter" maxLength={50} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className=" text-xs" htmlFor="menuDescription">Menu Description (Optional)</Label>
                                            <Textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} id="menuDescription" placeholder="Add a short description or notes about this menu" />
                                        </div>
                                    </div>
                                </div>
                                <div className='px-5 py-6 bg-white rounded-2xl border border-[#E5E7EB] w-full space-y-4'>
                                    <h2 className='text-[#111827] font-medium text-sm'>
                                        Categorization
                                    </h2>
                                    <div className='space-y-5'>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Menu Category<span className='text-[#EF4444]'>*</span></Label>
                                            <RadioGroup value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })} className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {["Starters", "Main Dish ", "Dessert", "Drink", "Appetizer"].map((meal) => (
                                                    <div key={meal} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={meal} id={meal} />
                                                        <Label htmlFor={meal}>{meal}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Menu Availability (Meal Time)</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {["Breakfast", "Brunch", "Lunch", "Dinner", "Late Night", "All Day"].map((meal) => (
                                                    <div key={meal} className="flex items-center space-x-2">
                                                        <Checkbox defaultChecked={newItem.mealTimes.includes(meal)} id={meal} onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setNewItem({ ...newItem, mealTimes: [...newItem.mealTimes, meal] });
                                                            } else {
                                                                setNewItem({ ...newItem, mealTimes: newItem.mealTimes.filter(item => item !== meal) });
                                                            }
                                                        }} />
                                                        <Label htmlFor={meal}>{meal}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Menu Assigned<span className='text-[#EF4444]'>*</span></Label>
                                            <RadioGroup value={newItem.assignedMenu} onValueChange={(value) => setNewItem({ ...newItem, assignedMenu: value })} className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {menus.map((meal) => (
                                                    <div key={meal._id} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={meal._id} id={meal._id} />
                                                        <Label htmlFor={meal._id}>{meal.name}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                        <div className="mt-6">
                                            <label className="block text-xs font-medium text-gray-700">Tags</label>
                                            <div className="mt-2">
                                                <div className="flex gap-2 flex-wrap">
                                                    {tags.map((t) => (
                                                        <button
                                                            type="button"
                                                            key={t}
                                                            onClick={() => toggleTag(t)}
                                                            className={`px-3 py-1 rounded-full text-xs border ${newItem.tags.includes(t) ? "bg-gray-800 text-white" : "bg-white"
                                                                }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>


                                                <div className="mt-3 flex gap-2">
                                                    <input
                                                        value={newTag}
                                                        onChange={(e) => setNewTag(e.target.value)}
                                                        placeholder="Add tag"
                                                        className="border rounded px-3 py-2 w-44"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={addTag}
                                                        className="px-3 py-2 rounded bg-indigo-600 text-white"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='px-5 py-6 bg-white rounded-2xl border border-[#E5E7EB] w-full space-y-4'>
                                    <h2 className='text-[#111827] font-medium text-sm'>
                                        Pricing
                                    </h2>
                                    <div className="gap-2 items-center w-full flex">
                                        <div className="flex flex-col gap-4 items-start">
                                            <label className="text-sm font-medium">Price</label>
                                            <div className="md:col-span-2 flex gap-4 items-center">
                                                <div className="flex items-center gap-2 border rounded px-3 py-2 w-full">
                                                    <span className="text-lg">₦</span>
                                                    <input
                                                        type="number"
                                                        value={newItem.price}
                                                        onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                                                        className="w-full outline-none"
                                                    />
                                                </div>
                                            </div>


                                        </div>
                                        <div className="flex items-start flex-col gap-2">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={newItem.discount}
                                                    onChange={(e) => setNewItem({ ...newItem, discount: e.target.checked })}
                                                    className="h-5 w-5"
                                                />
                                                <span className="text-sm">Discount</span>
                                            </label>


                                            {newItem.discount && (
                                                <div className="flex items-center gap-2 border rounded px-3 py-2">
                                                    <span>₦</span>
                                                    <input
                                                        type="number"
                                                        value={newItem.discountPrice}
                                                        onChange={(e) => setNewItem({ ...newItem, discountPrice: Number(e.target.value) })}
                                                        className="w-28 outline-none"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='space-y-6'>
                                <div htmlFor='item-cover-image' className='px-5 block py-6 bg-white rounded-2xl border border-[#E5E7EB] w-full space-y-4'>
                                    <h2 className='text-[#111827] font-medium text-sm'>
                                        Images
                                    </h2>
                                    <div className="space-y-2">
                                        <Label>Cover Image (Optional)</Label>
                                        <label htmlFor='item-cover-image' className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
                                            {uploadLoading ? <Loader2 className="w-6 h-6 mb-2 animate-spin" /> : <DownloadCloud className="w-6 h-6 mb-2" />}
                                            <p>Drag and drop an image here, or</p>
                                            {uploadLoading ? "Uploading..." :
                                                <Button asChild variant="outline" size="sm" className="mt-2">
                                                <label htmlFor="item-cover-image" className="cursor-pointer">Browse Files</label>
                                                </Button>
                                            }
                                            <p className="text-xs mt-1">JPG, PNG, or GIF • Max 5MB</p>
                                            <input
                                                type='file'
                                                id='item-cover-image'
                                                accept='image/*'
                                                max={5242880}
                                                onChange={(e) => e.target.files && handleImageUpload(e.target.files, setNewItem)}
                                                className='sr-only'
                                                disabled={uploadLoading}
                                            />
                                        </label>
                                        {newItem.coverImage && (
                                            <div className="w-32 h-32 rounded-md overflow-hidden">
                                                <img
                                                    src={newItem.coverImage}
                                                    alt="Cover"
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='px-5 py-6 bg-white rounded-2xl border border-[#E5E7EB] w-full items-center flex gap-4 justify-between'>
                                    <h2 className='text-[#111827] font-medium text-sm'>
                                        Add-ons & Variants
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox defaultChecked={newItem.addOns} onCheckedChange={(value) => setNewItem({ ...newItem, addOns: value })} id="addons-variants" />
                                        <Label htmlFor="addons-variants">Enable Add-ons</Label>
                                    </div>
                                </div>
                                <div className="w-full rounded-lg bg-transparent p-4">
                                    <div className="flex flex-col space-y-2">
                                        <Label className="text-sm font-medium text-foreground">Menu Availability</Label>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-base font-medium text-foreground">
                                                    Show item on menu
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    Make this menu item visible
                                                </span>
                                            </div>
                                            <Switch
                                                checked={newItem.isVisible}
                                                onCheckedChange={(value) => setNewItem({ ...newItem, isVisible: value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='fixed flex justify-between bottom-0 left-0 w-full px-8 py-4 bg-white border-t'>
                <DashboardButton onClick={handleCancel} variant="secondary" className="px-6 w-[158px] text-sm text-[#606368]" text={step === 0 ? "Cancel" : "Back"} />
                <DashboardButton onClick={handleNext} disabled={loading} icon={loading && <Loader2 className="animate-spin size-5" />} variant="primary" className="px-6 w-[384px] text-sm" text={loading ? "Loading" : "Create Menu Item"} />
            </div>
            {successModal && (
                <div className="fixed inset-0 bg-black/50 flex h-screen items-center py-10 justify-center z-50">
                    <div className="max-w-2xl h-full bg-gray-50 flex flex-col rounded-2xl overflow-y-auto px-4 py-10">
                        {/* Success Icon */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-[#37703F1A] rounded-full flex items-center justify-center">
                                    <div className="w-12 h-12 bg-[#37703F] rounded-full flex items-center justify-center">
                                        <Check className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-xl font-semibold text-gray-800">
                                Menu Successfully Created
                            </h1>
                            <p className="text-gray-500 mt-2 max-w-md">
                                Your pre-selected meals have been confirmed for your upcoming reservation
                            </p>
                        </div>

                        {/* Menu Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-2xl mb-6">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-3">Menu Summary</h2>
                                <hr className="mb-4" />

                                <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">
                                    <div className='space-y-3'>
                                        <div>
                                            <p className="text-gray-500">Menu Name</p>
                                            <p className="font-medium">{createItem.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Date Created</p>
                                            <p className="font-medium">{new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className='space-y-3'>
                                        <div>
                                            <p className="text-gray-500">Meal Times</p>
                                            <p className="font-medium">{createItem.mealTimes.join(", ")}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Meal Tags</p>
                                            <p className="font-medium">{createItem.tags.join(", ")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
                                <button onClick={() => {
                                    navigate(-1)
                                }} className="flex-1 border border-gray-300 rounded-xl py-3 font-medium text-gray-700 hover:bg-gray-100 transition">
                                    Back to Menu List
                                </button>
                                <button onClick={handleCreateNewMenu} className="flex-1 bg-teal-700 text-white rounded-xl py-3 font-medium hover:bg-teal-800 transition">
                                    Create New Menu
                                </button>
                            </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default CreateMenu;