import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Home, Store, Calendar, CreditCard, Bell, Shield, ChevronLeft, ChevronRight, Save, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { getSettings, updateSettings } from "@/services/admin.service";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { toast } from "react-toastify";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("overview");
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { subscribe, unsubscribe, sendMessage } = useWebSocket();

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  useEffect(() => {
    const handleSettingsUpdate = (payload) => {
      console.log("Settings update received:", payload);
      fetchSettings(); // Refresh settings data in real-time
    };

    subscribe("settings_updated", handleSettingsUpdate);

    return () => {
      unsubscribe("settings_updated");
    };
  }, [subscribe, unsubscribe]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getSettings();
      setSettings(response.data || {});
      setError(null);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Access denied. Please ensure you are logged in as an admin.");
        toast.error("Access denied. Admin privileges required.");
      } else {
        setError("Failed to load settings");
        toast.error("Failed to load settings");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (tabData) => {
    try {
      setSaving(true);

      const updatedSettings = { ...settings, ...formData, ...tabData };
      await updateSettings(updatedSettings);
      setSettings(updatedSettings);

      // Emit WebSocket event for real-time updates
      sendMessage("settings_updated", updatedSettings);

      toast.success("Settings saved successfully");
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Settings</span>
          <span>›</span>
          <span>Vendor Setting</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="bg-muted/50 mb-6 inline-flex min-w-full sm:min-w-0">
            <TabsTrigger value="overview" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="vendor" className="gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Vendor Settings</span>
            </TabsTrigger>
            <TabsTrigger value="reservation" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Reservation Rules</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payment & Payouts</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin Access & Security</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">General Information</h3>
            <p className="text-sm text-muted-foreground mb-6">Basic configuration settings</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name*</Label>
                <Input id="platform-name" value={formData['platform-name'] || 'Bookies'} onChange={(e) => handleInputChange('platform-name', e.target.value)} maxLength={50} />
                <p className="text-xs text-muted-foreground">
                  This name appears on vendor onboarding screens and email templates.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency*</Label>
                <Select value={formData.currency || 'ngn'} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ngn">Nigerian Naira</SelectItem>
                    <SelectItem value="usd">US Dollar</SelectItem>
                    <SelectItem value="eur">Euro</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Default currency used for all transactions on the platform.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-window">Booking Window Limit*</Label>
                <div className="flex gap-2">
                  <Input id="booking-window" defaultValue="90" type="number" className="max-w-24" />
                  <span className="flex items-center text-sm text-muted-foreground">days</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Users can book up to 90 days ahead.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone*</Label>
                <Select defaultValue="lagos">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lagos">GMT+1 - Africa/Lagos</SelectItem>
                    <SelectItem value="london">GMT+0 - Europe/London</SelectItem>
                    <SelectItem value="newyork">GMT-5 - America/New York</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  All system times will be displayed in this timezone by default.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-email">Support Contact Email*</Label>
                <Input id="support-email" defaultValue="support@bookings.com" type="email" />
                <p className="text-xs text-muted-foreground">
                  Used across user- and vendor-facing support areas.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-phone">Support Phone Number*</Label>
                <div className="flex gap-2">
                  <Select defaultValue="+234">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+234">+234</SelectItem>
                      <SelectItem value="+1">+1</SelectItem>
                      <SelectItem value="+44">+44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="support-phone" defaultValue="7012345678" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Optional helpline or WhatsApp number for local vendors.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={() => handleSaveSettings({ /* overview settings */ })} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="vendor" className="space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Vendor's Approval Process</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose how new vendor registrations should be processed.
                  </p>
                  <Select defaultValue="manual">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatic">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Allowed Service Type</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select which types of services vendors can offer on the platform.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox id="restaurant" defaultChecked />
                      <div>
                        <Label htmlFor="restaurant" className="font-medium">Restaurant</Label>
                        <p className="text-xs text-muted-foreground">Food & Dining Establishment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox id="hotel" defaultChecked />
                      <div>
                        <Label htmlFor="hotel" className="font-medium">Hotel</Label>
                        <p className="text-xs text-muted-foreground">Accommodation Services</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox id="bars" />
                      <div>
                        <Label htmlFor="bars" className="font-medium">Bars</Label>
                        <p className="text-xs text-muted-foreground">Beverage-focused establishments</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Approval Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select what types of services vendors can offer on the platform.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Auto-Approve for New Menus</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          When enabled, menus created by vendors go live immediately. When disabled, admin must approve new menus.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Auto-Approve for New Branches</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Determines whether vendors can independently create branches or require admin approval first.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Default Commission Rate</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set the default commission percentage for all vendors. This can be overridden for individual vendors.
                  </p>
                  <div className="flex gap-2">
                    <Input defaultValue="10" type="number" className="max-w-24" />
                    <span className="flex items-center text-sm">%</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Onboarding Message</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Customize the welcome message that vendors see after registration.
                  </p>
                  <Textarea 
                    placeholder="Add a short onboarding message here"
                    className="min-h-32"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Required Information During Vendor Onboarding</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure what information vendors must provide during registration.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Checkbox id="business-name" defaultChecked />
                        <Label htmlFor="business-name">Business Name</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="business-category" defaultChecked />
                        <Label htmlFor="business-category">Business Category</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="cac-doc" defaultChecked />
                        <Label htmlFor="cac-doc">CAC/Registration Doc</Label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Checkbox id="business-name2" defaultChecked />
                        <Label htmlFor="business-name2">Business Name</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="contact-email" defaultChecked />
                        <Label htmlFor="contact-email">Contact Email</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="social-media" />
                        <Label htmlFor="social-media">Social media handle (Optional)</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Changes</Button>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            <p className="text-sm text-muted-foreground">Page 1 of 30</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[1, 2, 3, "...", 10, 11, 12].map((page, idx) => (
                <Button
                  key={idx}
                  variant={page === 1 ? "default" : "outline"}
                  size="icon"
                  className="w-10 hidden sm:inline-flex"
                  disabled={page === "..."}
                >
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reservation" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Reservation Rules</h3>
            <p className="text-sm text-muted-foreground mb-6">Configure reservation policies and rules for the platform.</p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cancellation-policy">Cancellation Policy</Label>
                  <Select defaultValue={settings.cancellationPolicy || "flexible"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexible">Flexible - Free cancellation up to 24 hours</SelectItem>
                      <SelectItem value="moderate">Moderate - Free cancellation up to 48 hours</SelectItem>
                      <SelectItem value="strict">Strict - No free cancellation</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Default cancellation policy applied to all reservations.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advance-notice">Minimum Advance Notice (hours)</Label>
                  <Input
                    id="advance-notice"
                    type="number"
                    defaultValue={settings.advanceNotice || 2}
                    min="1"
                    max="72"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum hours required between booking and reservation time.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-guests">Maximum Guests per Reservation</Label>
                  <Input
                    id="max-guests"
                    type="number"
                    defaultValue={settings.maxGuests || 20}
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of guests allowed per reservation.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-limit">Daily Booking Limit per User</Label>
                  <Input
                    id="booking-limit"
                    type="number"
                    defaultValue={settings.bookingLimit || 3}
                    min="1"
                    max="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum reservations a user can make per day.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Guest Restrictions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allow-children" defaultChecked={settings.allowChildren} />
                    <Label htmlFor="allow-children">Allow children under 12</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allow-pets" defaultChecked={settings.allowPets} />
                    <Label htmlFor="allow-pets">Allow pets</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="smoking-allowed" defaultChecked={settings.smokingAllowed} />
                    <Label htmlFor="smoking-allowed">Smoking allowed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="alcohol-allowed" defaultChecked={settings.alcoholAllowed} />
                    <Label htmlFor="alcohol-allowed">Alcohol allowed</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Special Policies</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Require Phone Verification</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Users must verify their phone number before booking.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.requirePhoneVerification} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Allow Large Group Bookings</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Enable bookings for groups larger than 10 people.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.allowLargeGroups} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Auto-confirm Reservations</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Automatically confirm reservations without vendor approval.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.autoConfirmReservations} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={fetchSettings} disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => handleSaveSettings({ /* reservation settings */ })} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Payment & Payouts</h3>
            <p className="text-sm text-muted-foreground mb-6">Configure payment processing and vendor payout settings.</p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="payment-gateway">Primary Payment Gateway</Label>
                  <Select defaultValue={settings.paymentGateway || "paystack"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paystack">Paystack</SelectItem>
                      <SelectItem value="flutterwave">Flutterwave</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose the primary payment processor for transactions.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payout-frequency">Payout Frequency</Label>
                  <Select defaultValue={settings.payoutFrequency || "weekly"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How often vendors receive their payouts.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimum-payout">Minimum Payout Amount (₦)</Label>
                  <Input
                    id="minimum-payout"
                    type="number"
                    defaultValue={settings.minimumPayout || 5000}
                    min="1000"
                    step="500"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum amount required before processing a payout.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="processing-fee">Processing Fee (%)</Label>
                  <Input
                    id="processing-fee"
                    type="number"
                    defaultValue={settings.processingFee || 1.5}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee charged per transaction by the payment gateway.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Payment Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="card-payments" defaultChecked={settings.cardPayments} />
                    <Label htmlFor="card-payments">Credit/Debit Cards</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="bank-transfer" defaultChecked={settings.bankTransfer} />
                    <Label htmlFor="bank-transfer">Bank Transfer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="wallet-payments" defaultChecked={settings.walletPayments} />
                    <Label htmlFor="wallet-payments">Digital Wallets</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ussd-payments" defaultChecked={settings.ussdPayments} />
                    <Label htmlFor="ussd-payments">USSD Payments</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Payout Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Auto-Process Payouts</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Automatically process payouts when minimum threshold is reached.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.autoProcessPayouts} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Require Vendor Approval</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Vendors must approve each payout before processing.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.requireVendorApproval} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Instant Payouts</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Allow vendors to request instant payouts (additional fees apply).
                      </p>
                    </div>
                    <Switch defaultChecked={settings.instantPayouts} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Refund Policy</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="refund-window">Refund Window (days)</Label>
                    <Input
                      id="refund-window"
                      type="number"
                      defaultValue={settings.refundWindow || 7}
                      min="1"
                      max="30"
                    />
                    <p className="text-xs text-muted-foreground">
                      Days after reservation when refunds are allowed.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="refund-percentage">Refund Percentage (%)</Label>
                    <Input
                      id="refund-percentage"
                      type="number"
                      defaultValue={settings.refundPercentage || 100}
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-muted-foreground">
                      Percentage of payment refunded to customers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={fetchSettings} disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => handleSaveSettings({ /* payment settings */ })} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Notifications</h3>
            <p className="text-sm text-muted-foreground mb-6">Configure notification preferences for admin alerts and user communications.</p>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">New Vendor Registrations</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Receive email alerts when new vendors register on the platform.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.newVendorEmail} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">New Reservations</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Get notified via email for every new reservation made.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.newReservationEmail} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Weekly Reports</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Receive weekly summary reports of platform activity.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.weeklyReportsEmail} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Payment Failures</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Alerts for failed payment transactions that need attention.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.paymentFailureEmail} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">SMS Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Reservation Confirmations</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Send SMS confirmations to customers when reservations are confirmed.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.reservationConfirmSMS} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Reservation Reminders</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Send SMS reminders 24 hours before reservation time.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.reservationReminderSMS} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Cancellation Alerts</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Notify customers via SMS when reservations are cancelled.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.cancellationAlertSMS} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Vendor Payout Notifications</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Send SMS alerts to vendors when payouts are processed.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.payoutNotificationSMS} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Vendor App Notifications</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Push notifications for vendors about new orders and updates.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.vendorPushNotifications} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Admin Dashboard Alerts</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Real-time alerts in the admin dashboard for critical events.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.adminDashboardAlerts} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">System Maintenance Notices</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Notify users about scheduled maintenance and system updates.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.systemMaintenanceNotices} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Templates</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcome-email-template">Welcome Email Template</Label>
                    <Textarea
                      id="welcome-email-template"
                      placeholder="Customize the welcome email sent to new vendors..."
                      className="min-h-20"
                      defaultValue={settings.welcomeEmailTemplate || ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      HTML template for vendor welcome emails.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reservation-confirm-template">Reservation Confirmation Template</Label>
                    <Textarea
                      id="reservation-confirm-template"
                      placeholder="Customize reservation confirmation messages..."
                      className="min-h-20"
                      defaultValue={settings.reservationConfirmTemplate || ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      Template for reservation confirmation emails and SMS.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Settings</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="notification-frequency">Notification Frequency</Label>
                    <Select defaultValue={settings.notificationFrequency || "immediate"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How often to send notification digests.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-hours-start">Quiet Hours Start</Label>
                    <Input
                      id="quiet-hours-start"
                      type="time"
                      defaultValue={settings.quietHoursStart || "22:00"}
                    />
                    <p className="text-xs text-muted-foreground">
                      Start time for quiet hours (no notifications).
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-hours-end">Quiet Hours End</Label>
                    <Input
                      id="quiet-hours-end"
                      type="time"
                      defaultValue={settings.quietHoursEnd || "08:00"}
                    />
                    <p className="text-xs text-muted-foreground">
                      End time for quiet hours.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-notifications-day">Max Notifications per Day</Label>
                    <Input
                      id="max-notifications-day"
                      type="number"
                      defaultValue={settings.maxNotificationsDay || 50}
                      min="10"
                      max="200"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum notifications allowed per day to prevent spam.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={fetchSettings} disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => handleSaveSettings({ /* notification settings */ })} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Admin Access & Security</h3>
            <p className="text-sm text-muted-foreground mb-6">Manage admin access, authentication, and security settings.</p>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Authentication Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Require 2FA for all admin accounts.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.require2FA} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Session Timeout</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Automatically log out inactive users.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.sessionTimeout} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Password Expiry</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Force password changes every 90 days.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.passwordExpiry} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Access Control</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                    <Input
                      id="max-login-attempts"
                      type="number"
                      defaultValue={settings.maxLoginAttempts || 5}
                      min="3"
                      max="10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of failed attempts before account lockout.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockout-duration"
                      type="number"
                      defaultValue={settings.lockoutDuration || 30}
                      min="5"
                      max="120"
                    />
                    <p className="text-xs text-muted-foreground">
                      How long to lock account after failed attempts.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-min-length">Minimum Password Length</Label>
                    <Input
                      id="password-min-length"
                      type="number"
                      defaultValue={settings.passwordMinLength || 8}
                      min="6"
                      max="20"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum characters required for passwords.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-duration">Session Duration (hours)</Label>
                    <Input
                      id="session-duration"
                      type="number"
                      defaultValue={settings.sessionDuration || 8}
                      min="1"
                      max="24"
                    />
                    <p className="text-xs text-muted-foreground">
                      How long admin sessions remain active.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Security Policies</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">IP Whitelisting</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Restrict admin access to specific IP addresses.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.ipWhitelisting} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Audit Logging</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Log all admin actions for security monitoring.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.auditLogging} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Data Encryption</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Encrypt sensitive data at rest and in transit.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.dataEncryption} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">API Rate Limiting</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Limit API requests to prevent abuse.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.apiRateLimiting} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Admin Roles & Permissions</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="super-admin" defaultChecked />
                      <Label htmlFor="super-admin">Super Admin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="vendor-manager" defaultChecked />
                      <Label htmlFor="vendor-manager">Vendor Manager</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="finance-admin" defaultChecked />
                      <Label htmlFor="finance-admin">Finance Admin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="support-admin" defaultChecked />
                      <Label htmlFor="support-admin">Support Admin</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-roles">Custom Roles</Label>
                    <Textarea
                      id="custom-roles"
                      placeholder="Define custom admin roles and permissions..."
                      className="min-h-20"
                      defaultValue={settings.customRoles || ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      JSON format for custom role definitions.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Security Monitoring</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Failed Login Alerts</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Send alerts for suspicious login attempts.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.failedLoginAlerts} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Security Incident Reports</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Generate reports for security events.
                      </p>
                    </div>
                    <Switch defaultChecked={settings.securityReports} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={fetchSettings} disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => handleSaveSettings({ /* security settings */ })} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
