import { Label } from '@/components/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { menuService } from '@/services/menu.service';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner';

const CreateMenuItem = () => {
    const initialTags = ["Spicy", "Popular", "Savory"];
    const [tags, setTags] = useState(initialTags);
    const [newTag, setNewTag] = useState("");
    const [menus, setMenus] = useState([]);
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
        assignedMenus: [],
        isVisible: true,
    })

    useEffect(() => {
        async function fetchMenuItems() {
            try {
                const items = await menuService.getMenus()
                setMenus(items.menus)
            } catch (error) {
                console.error(error)
                toast.error("Failed to fetch menus")
            }
        }
        fetchMenuItems()
    }, [])

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    const toggleTag = (t) => {
        setNewItem((prev) => ({
            ...prev, tags:
                prev.tags.includes(t) ? prev.tags.filter((x) => x !== t) : [...prev.tags, t]
        }));
    };

    const handleImageUpload = useCallback(
        async (files, setImage) => {
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
            }
        },
        [newItem.images]
    )


    const addTag = () => {
        if (!newTag.trim()) return;
        if (!tags.includes(newTag.trim())) {
            setTags((t) => [...t, newTag.trim()]);
        }
        setNewTag("");
    };
    return (
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
                                {["Starters", "Main Dish ", "Dessert", "Drink"].map((meal) => (
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
                            <h3 className="font-semibold text-xs mb-4">Menu Assignment</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {menus && menus.map((meal) => (
                                    <div key={meal} className="flex items-center space-x-2">
                                        <Checkbox defaultChecked={newItem.assignedMenus.includes(meal)} id={meal} onCheckedChange={(checked) => {
                                            if (checked) {
                                                setNewItem({ ...newItem, assignedMenus: [...newItem.assignedMenus, meal] });
                                            } else {
                                                setNewItem({ ...newItem, assignedMenus: newItem.assignedMenus.filter(item => item !== meal) });
                                            }
                                        }} />
                                        <Label htmlFor={meal}>{meal}</Label>
                                    </div>
                                ))}
                            </div>
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
                            <DownloadCloud className="w-6 h-6 mb-2" />
                            <p>Drag and drop an image here, or</p>
                            <Button asChild variant="outline" size="sm" className="mt-2">
                                <label htmlFor="item-cover-image" className="cursor-pointer">Browse Files</label>
                            </Button>
                            <p className="text-xs mt-1">JPG, PNG, or GIF • Max 5MB</p>
                            <input
                                type='file'
                                id='item-cover-image'
                                accept='image/*'
                                max={5242880}
                                onChange={(e) => e.target.files && handleImageUpload(e.target.files, setNewItem)}
                                className='sr-only'
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
    )
}

export default CreateMenuItem