import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Home, Store, Calendar, CreditCard, Bell, Shield, ChevronLeft, ChevronRight } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("overview");

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
                <Input id="platform-name" defaultValue="Bookies" maxLength={50} />
                <p className="text-xs text-muted-foreground">
                  This name appears on vendor onboarding screens and email templates.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency*</Label>
                <Select defaultValue="ngn">
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
              <Button>Save Changes</Button>
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
            <p className="text-muted-foreground">Configure reservation policies and rules.</p>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Payment & Payouts</h3>
            <p className="text-muted-foreground">Manage payment and payout settings.</p>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Notifications</h3>
            <p className="text-muted-foreground">Configure notification preferences.</p>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Admin Access & Security</h3>
            <p className="text-muted-foreground">Manage admin access and security settings.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
