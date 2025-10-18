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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { menuService } from '@/services/menu.service';
import axios from 'axios';
import { Check, CheckCircle, DownloadCloud, Loader2, Plus, Upload, X } from 'lucide-react';
import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const CreateMenu = () => {
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(selectedItems);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSelectedItems(items); // Use your actual state setter here
    };

    const [step, setStep] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState('exist')
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
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const navigate = useNavigate();
    const initialTags = ["Spicy", "Popular", "Savory"];
    const [tags, setTags] = useState(initialTags);
    const [newTag, setNewTag] = useState("");
    const [createItem, setCreateItem] = useState(null);
    const [formData, setFormData] = useState({
        id: `menu-${Date.now()}`,
        name: "",
        description: "",
        menuType: [],
        mealTimes: [],
        coverImage: "",
        isAvailable: true,
        pricingModel: "fixed",
        price: 10000,
        items: [],
        isVisible: true,
    })

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


    const handleAdd = (item) => {
        if (!selectedItems.find((i) => i._id === item._id)) {
            setSelectedItems([...selectedItems, item]);
            setFormData({ ...formData, items: [...formData.items, item._id] });
        }
    };

    const handleNext = async () => {
        if (step <= 1) {
            if (activeTab === "new" && step === 1) {
                console.log(newItem)
                if (newItem.name && newItem.category.length > 0 && newItem.tags.length > 0 && newItem.price > 0) {
                    const createdItem = await menuService.createMenuItem({ ...newItem, assignedMenus: [formData.id] });
                    setSelectedItems((prev) => [...prev, createdItem]);
                    setCreateItem(createdItem._id);
                    setFormData({ ...formData, items: [...formData.items, createdItem._id] });
                    toast.success("Menu item created and added to menu")
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
                    })
                }
            } else {
                setStep(prev => prev + 1)
            }
        } else {
            try {
                setLoading(true)
                await menuService.createMenu(formData)
                setSuccessModal(true)
            } catch (error) {
                console.error(error)
                toast.error(error.response.data.message)
            } finally {
                setLoading(false)
            }
        }
    }

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
        [formData.coverImage, newItem.images]
    )

    const handleCancel = () => {
        if (step === 0) {
            navigate(-1)
        } else {
            setStep(prev => prev - 1)
        }
    }

    const handleClear = (id) => {
        if (id) {
            setSelectedItems(selectedItems.filter((item) => item.id !== id));
        } else {
            setSelectedItems([])
            setFormData({ ...formData, items: [] })
        }
    };

    const steps = [
        {
            title: "Menu",
            icon: DishCover
        },
        {
            title: "Add Menu Items",
            icon: DishCover
        },
        {
            title: "Payment",
            icon: Cash2
        },
    ]

    useEffect(() => {
        async function fetchMenuItems() {
            try {
                const items = await menuService.getMenuItems()
                setMenuItems(items.menuItems)
            } catch (error) {
                console.error(error)
                toast.error("Failed to fetch menu items")
            }
        }
        fetchMenuItems()
    }, [createItem])

    const formattedItems = menuItems.reduce((acc, item) => {
        const existingCategory = acc.find(group => group.category === item.category);

        const itemData = {
            _id: item._id,
            name: item.name,
            price: item.price,
            description: item.description,
            category: item.category,
            tags: item.tags,
            mealTime: item.mealTime,
            discount: item.discount,
            discountPrice: item.discountPrice,
            addOns: item.addOns,
            coverImage: item.coverImage,
            assignedMenus: item.assignedMenus,
            isVisible: item.isVisible,
        };

        if (existingCategory) {
            existingCategory.items.push(itemData);
        } else {
            acc.push({
                category: item.category,
                items: [itemData]
            });
        }

        return acc;
    }, []);


    return (
        <div className='bg-[#F9FAFB] min-h-dvh pb-16'>
            <Header2 title="Create Menu" />
            {step > 0 && (
                <div className="flex items-center gap-4 p-3 bg-[#E7F0F0]">
                    {/* Cover Image */}
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                        <img
                            src={formData.coverImage || "/food.jpg"}
                            alt="Joe's Platter"
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col">
                        <p className="font-medium">{formData.name || "Joe's Platter"}</p>
                        <p className="text-sm text-gray-500">
                            <span className="mr-2">Menu Type: {formData.menuType.join(", ") || "A la Carte, Buffet"}</span>
                            <span className="mx-1">•</span>
                            <span>Meal Time: {formData.mealTimes.join(", ") || "All Day"}</span>
                        </p>
                    </div>
                </div>
            )}
            <div className=' flex'>
                <div className='md:p-6 space-y-[45px] flex-1'>
                    <div className='max-w-[600px] mx-auto flex gap-6 items-center justify-center'>
                        {steps.map((step1, i) => (
                            <div key={i} className='flex gap-6'>
                                <div className='flex items-center gap-2'>
                                    <div className={`p-2.5 w-auto rounded-full ${i <= step ? "bg-[#0A6C6D]" : "bg-[#E5E7EB]"}`}>
                                        {i < step ? <Check className='size-5 text-white' /> : <step1.icon className={`${i <= step ? "text-white" : "text-[#606368]"}`} fill={i <= step ? "#fff" : "#606368"} />}
                                    </div>
                                    <div className={`text-sm font-medium ${i <= step ? "text-[#0A6C6D]" : "text-[#606368]"}`}>
                                        {step1.title}
                                    </div>
                                </div>
                                <div className={`w-16 mt-5 h-0.5 rounded-full ${i === 2 ? "hidden" : i <= step ? "bg-[#0A6C6D] " : "bg-[#606368]"}`} />
                            </div>
                        ))}
                    </div>

                    {step === 0 && (
                        <div className='grid md:grid-cols-2 max-w-[1000px] p-5 gap-5 bg-white border mx-auto rounded-2xl'>
                            <div className='space-y-5'>

                                <div className="space-y-2">
                                    <Label htmlFor="menuName">Menu name*</Label>
                                    <Input id="menuName" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g Joe's Platter" maxLength={50} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="menuDescription">Menu Description (Optional)</Label>
                                    <Textarea id="menuDescription" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Add a short description or notes about this menu" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Menu Type</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {["A la Carte", "Buffet", "Set Menu", "Tasting Menu", "Takeaway"].map((type) => (
                                            <div key={type} className="flex items-center space-x-2">
                                                <Checkbox id={type} checked={formData.menuType.includes(type)} onCheckedChange={() => {
                                                    if (formData.menuType.includes(type)) {
                                                        setFormData({
                                                            ...formData,
                                                            menuType: formData.menuType.filter(t => t !== type)
                                                        })
                                                    } else {
                                                        setFormData({
                                                            ...formData,
                                                            menuType: [...formData.menuType, type]
                                                        })
                                                    }
                                                }} />
                                                <Label htmlFor={type}>{type}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Menu Availability (Meal Time)</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {["Breakfast", "Brunch", "Lunch", "Dinner", "Late Night", "All Day"].map((meal) => (
                                            <div key={meal} className="flex items-center space-x-2">
                                                <Checkbox id={meal} checked={formData.mealTimes.includes(meal)} onCheckedChange={() => {
                                                    if (formData.mealTimes.includes(meal)) {
                                                        setFormData({
                                                            ...formData,
                                                            mealTimes: formData.mealTimes.filter(m => m !== meal)
                                                        })
                                                    } else {
                                                        setFormData({
                                                            ...formData,
                                                            mealTimes: [...formData.mealTimes, meal]
                                                        })
                                                    }
                                                }} />
                                                <Label htmlFor={meal}>{meal}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Price*</Label>
                                    <RadioGroup value={formData.pricingModel} onValueChange={() => setFormData({ ...formData, pricingModel: formData.pricingModel === "fixed" ? "perItem" : "fixed" })} className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="fixed" id="fixed" />
                                            <Label htmlFor="fixed">Fixed Price</Label>
                                        </div>
                                        {formData.pricingModel === "fixed" && (
                                            <Input value={formData.fixedPrice} onChange={(e) => setFormData({ ...formData, fixedPrice: e.target.value })} type="number" placeholder="₦ 10,000" className="mt-2 w-full" />
                                        )}

                                        <div className="flex items-center space-x-2 mt-3">
                                            <RadioGroupItem value="perItem" id="perItem" />
                                            <Label htmlFor="perItem">Price per item</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className='space-y-5'>
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
                                            onChange={(e) => e.target.files && handleImageUpload(e.target.files, setFormData)}
                                            className='sr-only'
                                        />
                                    </label>
                                    {formData.coverImage && (
                                        <div className="w-32 h-32 rounded-md overflow-hidden">
                                            <img
                                                src={formData.coverImage}
                                                alt="Cover"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label>Menu Availability</Label>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3>Show menu on this app</h3>
                                            <p className="text-sm text-gray-500">Make this menu visible to customers</p>
                                        </div>
                                        <Switch defaultChecked={formData.isVisible} onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 1 && (
                        <Tabs defaultValue="exist" value={activeTab} onValueChange={setActiveTab} className="space-y-4 ">
                            {/* Top Controls */}
                            <div className="flex flex-col items-center w-full gap-8 justify-between mx-auto max-w-[650px]">
                                <TabsList className="bg-white">
                                    <TabsTrigger value="exist" className="data-[state=active]:bg-[#E7F0F0] data-[state=active]:border-[#B3D1D2]">Add Existing Menu Item</TabsTrigger>
                                    <TabsTrigger value="new" className="data-[state=active]:bg-[#E7F0F0] data-[state=active]:border-[#B3D1D2] ">Create New Menu Item</TabsTrigger>
                                </TabsList>


                                <TabsContent value="exist" className="flex gap-2 w-full">
                                    <Input placeholder="Search menu items" className="w-full bg-white" />
                                    <Select>
                                        <SelectTrigger className="w-[150px] bg-white">
                                            <SelectValue placeholder="All Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Category</SelectItem>
                                            <SelectItem value="starters">Starters</SelectItem>
                                            <SelectItem value="main">Main Dish</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TabsContent>
                            </div>
                            <div className='max-w-[650px] w-full mx-auto'>

                                <TabsContent value="exist" className="space-y-5">
                                    {formattedItems.map((section) => (
                                        <Card key={section.category}>
                                            <CardHeader>
                                                <CardTitle>{section.category}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {section.items.map((item) => (
                                                    <div key={item._id} className="flex items-center justify-between border rounded-md p-3">
                                                        <div className="space-y-1">
                                                            <p className="font-medium">{item.name}</p>
                                                            {item.description && (
                                                                <p className="text-sm text-gray-500">{item.description}</p>
                                                            )}
                                                            <div className="flex gap-1 flex-wrap">
                                                                {item.tags?.map((tag) => (
                                                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="font-semibold">₦{item.price.toLocaleString()}</span>
                                                            <DashboardButton onClick={() => handleAdd(item)} variant="primary" text="Add" icon={<Plus className="size-5" />} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </TabsContent>
                            </div>
                            <div className='max-w-[1300px] w-full mx-auto'>

                                <TabsContent value="new">
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
                                                        <div className="border-2 border-dashed border-[#E0B300] rounded-md p-4 bg-yellow-50">
                                                            <div className="font-medium text-sm">{formData.name}</div>
                                                            <div className="text-xs text-gray-600 mt-1">Current menu - Item will be displayed here</div>
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
                                </TabsContent>
                            </div>
                        </Tabs >
                    )}
                </div>
                {step === 1 && selectedItems.length > 0 && (
                    <div className='bg-[#F4F4F4] w-3/7 border-l space-y-5 p-8 min-h-dvh border-[#E5E7EB]'>
                        <h2>Preview</h2>
                        <Card className="p-5">
                            <CardHeader className="p-0 gap-0">
                                <CardTitle className="text-sm">Joe&apos;s Platter Menu List</CardTitle>
                                <p className="text-xs text-gray-500">Drag to reorder items in your menu</p>
                            </CardHeader>
                            <CardContent className="space-y-3 p-0">
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="preview-list">
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="space-y-3"
                                                style={{
                                                    background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    minHeight: 100,
                                                    width: '100%', // ✅ Important: keeps items from overflowing
                                                    boxSizing: 'border-box',
                                                }}
                                            >
                                                {selectedItems.map((item, index) => (
                                                    <DraggableBox
                                                        key={item._id}
                                                        item={item}
                                                        index={index}
                                                        handleClear={handleClear}
                                                    />
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>

                                    <div className="pt-3">
                                        <p className='flex justify-between items-center'>Total Items: <span>{selectedItems.length}</span></p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2 w-full"
                                            onClick={() => handleClear()}
                                        >
                                            Clear All
                                        </Button>
                                    </div>
                                </DragDropContext>

                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            <div className='fixed flex justify-between bottom-0 left-0 w-full px-8 py-4 bg-white border-t'>
                <DashboardButton onClick={handleCancel} variant="secondary" className="px-6 w-[158px] text-sm text-[#606368]" text={step === 0 ? "Cancel" : "Back"} />
                <DashboardButton onClick={handleNext} disabled={selectedItems.length === 0 && step > 0 && activeTab !== "new" || loading} icon={loading && <Loader2 className="animate-spin size-5" />} variant="primary" className="px-6 w-[384px] text-sm" text={loading ? "Loading" : step === 0 ? "Continue to Meal Selection" : activeTab === "new" ? "Add Item to Menu" : "Save & Finish Menu"} />
            </div>
            {successModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-md mx-auto">
                        <div className="flex flex-col items-center">
                            <CheckCircle className="text-green-500 size-10 mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">Menu Created!</h2>
                            <p className="text-gray-600 mb-4 text-center">Your menu has been successfully created and is now live on your restaurant&apos;s app.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CreateMenu
const DraggableBox = ({ item, index, handleClear }) => (
    <Draggable draggableId={item._id} index={index}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="w-full"
                style={{
                    userSelect: 'none',
                    margin: '0 0 8px 0',
                    width: '100%', // ✅ Prevents it from expanding
                    ...provided.draggableProps.style, // ✅ Always merge this
                }}

            >
                <div className={`text-center rounded ${snapshot.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                    <div className="border border-[#E5E7EB] bg-[#F9FAFB] h-full flex items-center rounded-md gap-3 p-3 cursor-grab">
                        <div>
                            <DragDrop className="stroke-[#606368]" />
                        </div>
                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <img
                                src={item.coverImage || "/food.jpg"}
                                alt={item.name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className='w-full'>
                            <div className='flex items-center justify-between'>
                                <p className="font-medium">{item.name}</p>
                                <div className='cursor-pointer' onClick={() => handleClear(item.id)}>
                                    <Delete2 className="text-[#606368]" />
                                </div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className="text-xs text-gray-500">Category: {item.category}</p>
                                <span className="font-semibold">₦{item.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </Draggable>
);
