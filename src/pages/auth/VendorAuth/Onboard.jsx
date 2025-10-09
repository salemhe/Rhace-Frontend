import HeroImage from "@/components/auth/HeroImage"


import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  MapPin,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Upload,
  Check,
  Clock,
  Utensils,
  Music,
  X,
  Phone,
  Globe,
  DollarSign,
  Tag,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import axios from "axios"
import api from "@/lib/axios"
import { useNavigate } from "react-router"
import { authService } from "@/services/auth.service"

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const STEPS = [
  {
    id: 1,
    title: "Business Profile",
    description: "Tell us about your business and how customers can reach you",
    icon: Building2,
  },
  {
    id: 2,
    title: "Payment Setup",
    description: "Set up your payment information for secure transactions",
    icon: CreditCard,
  },
  {
    id: 3,
    title: "Business Details",
    description: "Add specific details about your services and offerings",
    icon: Tag,
  },
]

const NIGERIAN_BANKS = [
  { name: "Access Bank", code: "044" },
  { name: "Citibank Nigeria", code: "023" },
  { name: "Ecobank Nigeria", code: "050" },
  { name: "Fidelity Bank", code: "070" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "First City Monument Bank", code: "214" },
  { name: "Guaranty Trust Bank", code: "058" },
  { name: "Heritage Bank", code: "030" },
  { name: "Keystone Bank", code: "082" },
  { name: "Polaris Bank", code: "076" },
  { name: "Providus Bank", code: "101" },
  { name: "Stanbic IBTC Bank", code: "221" },
  { name: "Standard Chartered Bank", code: "068" },
  { name: "Sterling Bank", code: "232" },
  { name: "Union Bank of Nigeria", code: "032" },
  { name: "United Bank For Africa", code: "033" },
  { name: "Unity Bank", code: "215" },
  { name: "Wema Bank", code: "035" },
  { name: "Zenith Bank", code: "057" },
]

export function Onboard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    profileImages: [],
    businessDescription: "",
    vendorType: "",
    phone: "",
    address: "",
    website: "",
    bankName: "",
    bankCode: "",
    accountNumber: "",
    accountName: "",
    priceRange: 1000,
    offer: "",
    openingTime: "",
    closingTime: "",
    cuisines: [],
    availableSlots: [],
    categories: [],
    dressCode: [],
    ageLimit: "",
    slots: 0,
  })
  const [uploadProgress, setUploadProgress] = useState({})
  const [isVerifyingBank, setIsVerifyingBank] = useState(false)
  const [isLoading, setIsloading] = useState(false)
  const [bankVerified, setBankVerified] = useState(false)
  const [banks, setBanks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleImageUpload = useCallback(
    async (files) => {
      const fileArray = Array.from(files).slice(0, 5) // Limit to 5 images

      const uploadedUrls = []

      for (const file of fileArray) {
        const fileName = file.name
        setUploadProgress((prev) => ({ ...prev, [fileName]: 0 }))

        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', UPLOAD_PRESET)

        try {
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData,
            {
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                )
                setUploadProgress((prev) => ({ ...prev, [fileName]: progress }))
              },
            }
          )

          const imageUrl = response.data.secure_url
          uploadedUrls.push(imageUrl)
        } catch (error) {
          console.error('Upload failed for', fileName, error)
          setUploadProgress((prev) => ({ ...prev, [fileName]: -1 })) // -1 to indicate failure
        }
      }

      updateFormData({ profileImages: [...formData.profileImages, ...uploadedUrls] })
    },
    [formData.profileImages]
  )

  const handleBankVerification = async () => {
    if (!formData.bankCode || !formData.accountNumber) return

    setIsVerifyingBank(true)
    setBankVerified(false)

    try {
      const response = await api.get('/payments/verify-account', {
        params: {
          account_number: formData.accountNumber,
          bank_code: formData.bankCode,
        },
      })

      const { accountName } = response.data

      updateFormData({
        bankName: banks.find((b) => b.code === formData.bankCode)?.name || '',
        accountName,
      })

      setBankVerified(true)
    } catch (error) {
      console.error('Account verification failed:', error)
      alert(error.response?.data?.error || 'Verification failed. Please try again.')
      setBankVerified(false)
    } finally {
      setIsVerifyingBank(false)
    }
  }


  const addTag = (field, value) => {
    const currentArray = formData[field]
    if (!currentArray.includes(value) && value.trim()) {
      updateFormData({ [field]: [...currentArray, value.trim()] })
    }
  }

  const removeTag = (field, value) => {
    const currentArray = formData[field]
    updateFormData({ [field]: currentArray.filter((item) => item !== value) })
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.profileImages.length >= 5 &&
          formData.businessDescription.trim() &&
          formData.vendorType &&
          formData.phone.trim() &&
          formData.address.trim()
        )
      case 2:
        return bankVerified && formData.accountName.trim()
      case 3:
        return formData.priceRange
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setIsloading(true)

    try {
      await authService.vendorOnboard(formData)

      // Handle response (optional: use response.data if needed)
      toast.success("Completed Onboarding Successfully!")

      // Optionally reset form or redirect
      navigate(`/dashboard`)
      // resetFormData()
    } catch (error) {
      console.error('Onboarding failed:', error)

      toast.error(
        error.response?.data?.error || 'Something went wrong. Please try again.'
      )
    } finally {
      setIsloading(false)
    }
  }

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await api.get('/payments/banks')
        setBanks(response.data.data)
      } catch (err) {
        setError('Failed to load banks')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBanks()
  }, [])

  return (
    <div className="w-full h-screen flex p-4 bg-white">
      <HeroImage role='vendor' />
      <div className='flex-1 h-full overflow-y-auto hide-scrollbar'>
        <div className="min-h-screen flex items-center py-5 justify-center">
          <Card className="w-full max-w-lg bg-white shadow-none gap-3 p-0 border-none">
            <CardHeader className="text-left">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-6 h-6 bg-[#60A5FA] rounded-full flex items-center justify-center"></div>
                <span className="text-xl font-semibold text-gray-900">Rhace</span>
              </div>
              {currentStep === 1 && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tell us about your business</h2>
                  <p className="text-muted-foreground text-pretty max-w-2xl">
                    Share some details about what you offer and how customers can find you.
                  </p>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Set up your payments</h2>
                  <p className="text-muted-foreground">Add your bank details to receive payments from customers.</p>
                </>
              )}
              {currentStep === 3 && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Business Details</h2>
                  <p className="text-muted-foreground">Add specific information about your services and pricing.</p>
                </>
              )}
            </CardHeader>

            <div className="flex items-center justify-center gap-2 px-6">
              {STEPS.map((step) => {
                const isCompleted = currentStep > step.id
                const isActive = currentStep === step.id

                return (
                  <div key={step.id} className="flex items-center w-full">
                    <div
                      className={cn("w-full h-2 rounded-full transition-all", {
                        "bg-primary": isCompleted || isActive,
                        "bg-border": !isCompleted && !isActive,
                      })}
                    />
                  </div>
                )
              })}
            </div>
            <CardContent>
              {currentStep === 1 && (
                <div className="space-y-8">
                  {/* Image Upload */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Business Photos (Upload at least 5)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your images here, or click to browse
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button variant="outline" asChild>
                        <label htmlFor="image-upload" className="cursor-pointer">
                          Choose Files
                        </label>
                      </Button>
                    </div>

                    {/* Upload Progress */}
                    {Object.entries(uploadProgress).map(([fileName, progress]) => (
                      <div key={fileName} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="truncate">{fileName}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    ))}

                    <p className="text-sm text-muted-foreground">{formData.profileImages.length} images uploaded</p>
                  </div>

                  {/* Business Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">
                      Business Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Tell customers what makes your business special..."
                      value={formData.businessDescription}
                      onChange={(e) => updateFormData({ businessDescription: e.target.value })}
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  {/* Vendor Category */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Business Type</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "hotel", label: "Hotel", Icon: Building2 },
                        { value: "restaurant", label: "Restaurant", Icon: Utensils },
                        { value: "club", label: "Club", Icon: Music },
                      ].map(({ value, label, Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => updateFormData({ vendorType: value })}
                          className={cn(
                            "p-4 rounded-lg border-2 transition-all flex gap-2 text-left hover:border-primary/50",
                            formData.vendorType === value ? "border-primary bg-primary/5" : "border-border",
                          )}
                        >
                          <Icon className="w-6 h-6 text-primary" />
                          <div className="font-medium">{label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={formData.phone}
                        onChange={(e) => updateFormData({ phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-base font-medium flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Website (Optional)
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={formData.website}
                        onChange={(e) => updateFormData({ website: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Business Address
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete business address..."
                      value={formData.address}
                      onChange={(e) => updateFormData({ address: e.target.value })}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  {/* Bank Selection */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Select Your Bank</Label>
                    <Select
                      value={formData.bankCode}
                      onValueChange={(value) => {
                        const bank = banks.find((b) => b.code === value)
                        updateFormData({
                          bankCode: value,
                          bankName: bank?.name || "",
                        })
                        setBankVerified(false)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks.map((bank, i) => (
                          <SelectItem key={i} value={bank.code}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Account Number */}
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="text-base font-medium">
                      Account Number
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="accountNumber"
                        placeholder="Enter your 10-digit account number"
                        value={formData.accountNumber}
                        onChange={(e) => {
                          updateFormData({ accountNumber: e.target.value })
                          setBankVerified(false)
                        }}
                        maxLength={10}
                      />
                      <Button
                        onClick={handleBankVerification}
                        disabled={!formData.bankCode || !formData.accountNumber || isVerifyingBank}
                        variant="outline"
                      >
                        {isVerifyingBank ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Verifying
                          </>
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Verification Result */}
                  {bankVerified && formData.accountName && (
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2 text-success mb-2">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Account Verified</span>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Account Name:</span> {formData.accountName}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Bank:</span> {formData.bankName}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Price Range
                    </Label>
                    <Input
                      type="number"
                      value={formData.priceRange}
                      onChange={(e) => {
                        const value = e.target.value
                        updateFormData({ priceRange: value === '' ? '' : Number(value) })
                      }}
                    />

                  </div>

                  {/* General Offer */}
                  <div className="space-y-2">
                    <Label htmlFor="offer" className="text-base font-medium">
                      Special Offers (Optional)
                    </Label>
                    <Input
                      id="offer"
                      placeholder="e.g., 20% off first booking, Free WiFi, etc."
                      value={formData.offer}
                      onChange={(e) => updateFormData({ offer: e.target.value })}
                    />
                  </div>

                  {/* Category-specific fields */}
                  {formData.vendorType === "restaurant" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="openingTime" className="text-base font-medium">
                            Opening Time
                          </Label>
                          <Input
                            id="openingTime"
                            type="time"
                            value={formData.openingTime}
                            onChange={(e) => updateFormData({ openingTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="closingTime" className="text-base font-medium">
                            Closing Time
                          </Label>
                          <Input
                            id="closingTime"
                            type="time"
                            value={formData.closingTime}
                            onChange={(e) => updateFormData({ closingTime: e.target.value })}
                          />
                        </div>
                      </div>

                      <TagInput
                        label="Cuisines"
                        placeholder="Add cuisine type (e.g., Italian, Nigerian, Chinese)"
                        tags={formData.cuisines}
                        onAdd={(value) => addTag("cuisines", value)}
                        onRemove={(value) => removeTag("cuisines", value)}
                      />

                      <TagInput
                        label="Available Slots"
                        placeholder="Add time slots (e.g., Breakfast, Lunch, Dinner)"
                        tags={formData.availableSlots}
                        onAdd={(value) => addTag("availableSlots", value)}
                        onRemove={(value) => removeTag("availableSlots", value)}
                      />
                    </div>
                  )}

                  {formData.vendorType === "club" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="openingTime" className="text-base font-medium">
                            Opening Time
                          </Label>
                          <Input
                            id="openingTime"
                            type="time"
                            value={formData.openingTime}
                            onChange={(e) => updateFormData({ openingTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="closingTime" className="text-base font-medium">
                            Closing Time
                          </Label>
                          <Input
                            id="closingTime"
                            type="time"
                            value={formData.closingTime}
                            onChange={(e) => updateFormData({ closingTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slots" className="text-base font-medium">
                            Available Slots
                          </Label>
                          <Input
                            id="slots"
                            type="number"
                            min="1"
                            placeholder="e.g., 100"
                            value={formData.slots || ""}
                            onChange={(e) => updateFormData({ slots: Number.parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>

                      <TagInput
                        label="Categories"
                        placeholder="Add categories (e.g., Nightclub, Lounge, Sports Bar)"
                        tags={formData.categories}
                        onAdd={(value) => addTag("categories", value)}
                        onRemove={(value) => removeTag("categories", value)}
                      />

                      <TagInput
                        label="Dress Code"
                        placeholder="Add dress code requirements (e.g., Smart Casual, Formal)"
                        tags={formData.dressCode}
                        onAdd={(value) => addTag("dressCode", value)}
                        onRemove={(value) => removeTag("dressCode", value)}
                      />

                      <div className="space-y-2">
                        <Label className="text-base font-medium">Age Limit</Label>
                        <Select value={formData.ageLimit} onValueChange={(value) => updateFormData({ ageLimit: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select age requirement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="16+">16 years and above</SelectItem>
                            <SelectItem value="18+">18 years and above</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button onClick={handleNext} disabled={!canProceedToNext()} className="flex items-center gap-2">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canProceedToNext()} className="flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  )
}

function TagInput({ label, placeholder, tags, onAdd, onRemove }) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      onAdd(inputValue)
      setInputValue("")
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">{label}</Label>
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button type="button" onClick={() => onRemove(tag)} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default Onboard