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
import { Check, DownloadCloud, Plus, Upload, X } from 'lucide-react';
import React, { forwardRef, useState } from 'react'

const CreateMenu = () => {
    const [step, setStep] = useState(0);
    const [priceType, setPriceType] = useState("fixed");
    const [selectedItems, setSelectedItems] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleAdd = (item) => {
        if (!selectedItems.find((i) => i.id === item.id)) {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleClear = () => setSelectedItems([]);

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
                                        {i < step ? <Check className='size-5 text-white' /> : <step1.icon fill={i <= step ? "#fff" : "#606368"} />}
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
                        <Tabs defaultValue="exist" className="space-y-4 mx-auto max-w-[650px]">
                            {/* Top Controls */}
                            <div className="flex flex-col items-center w-full gap-8 justify-between">
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

                            <TabsContent value="exist">
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
                                                        {/* <Button size="sm" onClick={() => handleAdd(item)}>
                                                            <Plus className="w-4 h-4 mr-1" /> Add
                                                        </Button> */}
                                                        <DashboardButton onClick={() => handleAdd(item)} variant="primary" text="Add" icon={<Plus className="size-5" />} />
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>
                        </Tabs >
                    )}
                    {step === 2 && (
                        <div className='max-w-[864px] p-5 bg-white border mx-auto rounded-2xl'>

                        </div>
                    )}
                    {step === 3 && (
                        <div className='max-w-[864px] p-5 bg-white border mx-auto rounded-2xl'>

                        </div>
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
                                    <div
                                        // bounds="parent"
                                        // onStart={() => setIsDragging(true)}
                                        // onStop={() => setIsDragging(false)}
                                        // enableUserSelectHack={false} // Optional, helps with iOS
                                        // touch-action="none" // Optional styling fix
                                    >
                                        <DraggableBox isDragging={isDragging} item={item} />
                                    </div>
                                ))}
                                <div className="pt-3">
                                    <p className='flex justify-between items-center'>Total Items: <span>{selectedItems.length}</span></p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 w-full"
                                        onClick={handleClear}
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
                <DashboardButton variant="secondary" className="px-6 w-[158px] text-sm text-[#606368]" text="Cancel" />
                <DashboardButton onClick={() => setStep(prev => prev + 1)} variant="primary" className="px-6 w-[384px] text-sm" text="Continue to Meal Selection" />
            </div>
        </div>
    )
}

export default CreateMenu

const DraggableBox = forwardRef(({ isDragging, item }, ref) => (
    <div
        ref={ref}
        className={`w-[100px] h-[100px] bg-blue-500 text-white text-center leading-[100px] rounded absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
    >
        <div key={item.id} className="border border-[#E5E7EB] bg-[#F9FAFB] flex items-center rounded-md gap-3 p-3 cursor-grab">
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
                    <div>
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