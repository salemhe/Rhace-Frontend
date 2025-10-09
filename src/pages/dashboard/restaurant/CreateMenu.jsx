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
import { Check, DownloadCloud, Loader2, Plus, Upload, X } from 'lucide-react';
import React, { forwardRef, useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const CreateMenu = () => {
    const [step, setStep] = useState(0);
    const [priceType, setPriceType] = useState("fixed");
    const [selectedItems, setSelectedItems] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState('exist')
    const [newItem, setNewItem] = useState({})
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false)
    const navigate = useNavigate();
    const initialTags = ["Spicy", "Popular", "Savory"];
    const [tags, setTags] = useState(initialTags);
    const [selectedTags, setSelectedTags] = useState([]);
    const [newTag, setNewTag] = useState("");

    const [price, setPrice] = useState(10000);
    const [hasDiscount, setHasDiscount] = useState(true);
    const [discountPrice, setDiscountPrice] = useState(2000);

    const toggleTag = (t) => {
        setSelectedTags((prev) =>
            prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
        );
    };


    const addTag = () => {
        if (!newTag.trim()) return;
        if (!tags.includes(newTag.trim())) {
            setTags((t) => [...t, newTag.trim()]);
        }
        setSelectedTags((s) => (s.includes(newTag.trim()) ? s : [...s, newTag.trim()]));
        setNewTag("");
    };


    const handleAdd = (item) => {
        if (!selectedItems.find((i) => i.id === item.id)) {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleNext = async () => {
        if (step < 1) {
            if (activeTab === "new" && newItem && step === 1) {
                setSelectedItems([...selectedItems, newItem]);
                setNewItem({})
            } else {
                setStep(prev => prev + 1)
            }
        } else {
            try {
                setLoading(true)
                setSuccessModal(true)
            } catch (error) {
                console.error(error)
                toast.error(error.response.data.message)
            } finally {
                setLoading(false)
            }
        }
    }

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

    const sampleMenu = [
        {
            category: "Starters",
            items: [
                { id: "1", name: "Buffalo wings", category: "Starters", price: 30000, description: "Description (if available)", tags: ["Spicy", "Popular", "Savory"] },
                { id: "2", name: "Signature Burger", category: "Starters", price: 30000, tags: ["Spicy", "Popular"] },
            ],
        },
        {
            category: "Main Dish",
            items: [
                { id: "3", name: "Buffalo wings", category: "Main Dish", price: 30000 },
                { id: "4", name: "Signature Burger", category: "Main Dish", price: 30000, tags: ["Savory"] },
            ],
        },
    ];

    return (
        <div className='bg-[#F9FAFB] min-h-dvh pb-16'>
            <Header2 title="Create Menu" />
            {step > 0 && (
                <div className="flex items-center gap-4 p-3 bg-[#E7F0F0]">
                    {/* Cover Image */}
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                        <img
                            src="/food.jpg" // replace with your image
                            alt="Joe's Platter"
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col">
                        <p className="font-medium">Joe&apos;s Platter</p>
                        <p className="text-sm text-gray-500">
                            <span className="mr-2">Menu Type: A la Carte, Buffet</span>
                            <span className="mx-1">•</span>
                            <span>Meal Time: All Day</span>
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
                                    <Input id="menuName" placeholder="e.g Joe's Platter" maxLength={50} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="menuDescription">Menu Description (Optional)</Label>
                                    <Textarea id="menuDescription" placeholder="Add a short description or notes about this menu" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Menu Type</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {["A la Carte", "Buffet", "Set Menu", "Tasting Menu", "Takeaway"].map((type) => (
                                            <div key={type} className="flex items-center space-x-2">
                                                <Checkbox id={type} />
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
                                                <Checkbox id={meal} />
                                                <Label htmlFor={meal}>{meal}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Price*</Label>
                                    <RadioGroup value={priceType} onValueChange={setPriceType}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="fixed" id="fixed" />
                                            <Label htmlFor="fixed">Fixed Price</Label>
                                        </div>
                                        {priceType === "fixed" && (
                                            <Input type="number" placeholder="₦ 10,000" className="mt-2 w-full" />
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
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
                                        <DownloadCloud className="w-6 h-6 mb-2" />
                                        <p>Drag and drop an image here, or</p>
                                        <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
                                        <p className="text-xs mt-1">JPG, PNG, or GIF • Max 5MB</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label>Menu Availability</Label>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3>Show menu on this app</h3>
                                            <p className="text-sm text-gray-500">Make this menu visible to customers</p>
                                        </div>
                                        <Switch defaultChecked />
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
                                    {sampleMenu.map((section) => (
                                        <Card key={section.category}>
                                            <CardHeader>
                                                <CardTitle>{section.category}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {section.items.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between border rounded-md p-3">
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
                                                        <Input id="menuName" placeholder="e.g Joe's Platter" maxLength={50} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className=" text-xs" htmlFor="menuDescription">Menu Description (Optional)</Label>
                                                        <Textarea id="menuDescription" placeholder="Add a short description or notes about this menu" />
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
                                                        <RadioGroup value={priceType} onValueChange={setPriceType} className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                                                                    <Checkbox id={meal} />
                                                                    <Label htmlFor={meal}>{meal}</Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="font-semibold text-xs mb-4">Menu Assignment</h3>
                                                        <div className="border-2 border-dashed border-[#E0B300] rounded-md p-4 bg-yellow-50">
                                                            <div className="font-medium text-sm">Joe's Potter</div>
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
                                                                        className={`px-3 py-1 rounded-full text-xs border ${selectedTags.includes(t) ? "bg-gray-800 text-white" : "bg-white"
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
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                                    <label className="text-sm font-medium">Price</label>
                                                    <div className="md:col-span-2 flex gap-4 items-center">
                                                        <div className="flex items-center gap-2 border rounded px-3 py-2 w-full">
                                                            <span className="text-lg">₦</span>
                                                            <input
                                                                type="number"
                                                                value={price}
                                                                onChange={(e) => setPrice(Number(e.target.value))}
                                                                className="w-full outline-none"
                                                            />
                                                        </div>


                                                        <div className="flex items-center gap-2">
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={hasDiscount}
                                                                    onChange={(e) => setHasDiscount(e.target.checked)}
                                                                    className="h-5 w-5"
                                                                />
                                                                <span className="text-sm">Discount</span>
                                                            </label>


                                                            {hasDiscount && (
                                                                <div className="flex items-center gap-2 border rounded px-3 py-2">
                                                                    <span>₦</span>
                                                                    <input
                                                                        type="number"
                                                                        value={discountPrice}
                                                                        onChange={(e) => setDiscountPrice(Number(e.target.value))}
                                                                        className="w-28 outline-none"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='space-y-6'>
                                            <div className='px-5 py-6 bg-white rounded-2xl border border-[#E5E7EB] w-full space-y-4'>
                                                <h2 className='text-[#111827] font-medium text-sm'>
                                                    Images
                                                </h2>
                                                <div></div>
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
                                {selectedItems.map((item) => (
                                    <DraggableBox isDragging={isDragging} item={item} handleClear={handleClear} />
                                ))}
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
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            <div className='fixed flex justify-between bottom-0 left-0 w-full px-8 py-4 bg-white border-t'>
                <DashboardButton onClick={handleCancel} variant="secondary" className="px-6 w-[158px] text-sm text-[#606368]" text={step === 0 ? "Cancel" : "Back"} />
                <DashboardButton onClick={handleNext} disabled={selectedItems.length === 0 && step > 0 && activeTab !== "new" || loading} icon={loading && <Loader2 className="animate-spin size-5" />} variant="primary" className="px-6 w-[384px] text-sm" text={loading ? "Loading" : step === 0 ? "Continue to Meal Selection" : activeTab === "new" ? "Add Item to Menu" : "Save & Finish Menu"} />
            </div>
        </div>
    )
}

export default CreateMenu

const DraggableBox = forwardRef(({ isDragging, item, handleClear }, ref) => (
    <div
        ref={ref}
        className={`text-center rounded ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
    >
        <div key={item.id} className="border border-[#E5E7EB] bg-[#F9FAFB] h-full flex items-center rounded-md gap-3 p-3 cursor-grab">
            <div>
                <DragDrop className="stroke-[#606368]" />
            </div>
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                <img
                    src="/food.jpg" // replace with your image
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
));