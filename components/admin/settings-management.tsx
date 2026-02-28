'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Loader2 } from 'lucide-react'
import { updateSettings } from '@/app/admin/settings/settings-actions'
import { useRouter } from 'next/navigation'

interface SettingsManagementProps {
    initialSettings: Record<string, any[]>
}

export function SettingsManagement({ initialSettings }: SettingsManagementProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [settings, setSettings] = useState({
        // Hotel Information
        hotel_name: getSettingValue(initialSettings, 'hotel_name', 'NICON Luxury Hotel'),
        hotel_address: getSettingValue(initialSettings, 'hotel_address', 'Abuja, Nigeria'),
        hotel_phone: getSettingValue(initialSettings, 'hotel_phone', '+234 XXX XXX XXXX'),
        hotel_email: getSettingValue(initialSettings, 'hotel_email', 'info@niconluxury.com'),
        hotel_description: getSettingValue(initialSettings, 'hotel_description', ''),

        // Booking Settings
        check_in_time: getSettingValue(initialSettings, 'check_in_time', '14:00'),
        check_out_time: getSettingValue(initialSettings, 'check_out_time', '12:00'),
        max_advance_days: getSettingValue(initialSettings, 'max_advance_days', '365'),
        min_stay_duration: getSettingValue(initialSettings, 'min_stay_duration', '1'),
        cancellation_policy: getSettingValue(initialSettings, 'cancellation_policy', 'Free cancellation up to 24 hours before check-in'),

        // Payment Settings
        tax_rate: getSettingValue(initialSettings, 'tax_rate', '7.5'),
        service_charge: getSettingValue(initialSettings, 'service_charge', '10'),
        currency: getSettingValue(initialSettings, 'currency', 'NGN'),
        currency_symbol: getSettingValue(initialSettings, 'currency_symbol', '₦'),

        // Email Notifications
        enable_booking_emails: getSettingValue(initialSettings, 'enable_booking_emails', 'true') === 'true',
        enable_cancellation_emails: getSettingValue(initialSettings, 'enable_cancellation_emails', 'true') === 'true',
        admin_notification_email: getSettingValue(initialSettings, 'admin_notification_email', 'admin@niconluxury.com'),

        // Social Media
        facebook_url: getSettingValue(initialSettings, 'facebook_url', ''),
        instagram_url: getSettingValue(initialSettings, 'instagram_url', ''),
        twitter_url: getSettingValue(initialSettings, 'twitter_url', ''),
        linkedin_url: getSettingValue(initialSettings, 'linkedin_url', ''),
    })

    function getSettingValue(settings: Record<string, any[]>, key: string, defaultValue: string = '') {
        for (const group in settings) {
            const setting = settings[group]?.find((s: any) => s.key === key)
            if (setting) return setting.value
        }
        return defaultValue
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const settingsArray = Object.entries(settings).map(([key, value]) => {
            const type = typeof value === 'boolean' ? 'boolean' :
                typeof value === 'number' ? 'number' : 'string'

            let group = 'general'
            if (key.includes('check_in') || key.includes('check_out') || key.includes('cancellation') || key.includes('advance') || key.includes('stay')) {
                group = 'booking'
            } else if (key.includes('tax') || key.includes('service') || key.includes('currency')) {
                group = 'payment'
            } else if (key.includes('email') || key.includes('notification')) {
                group = 'email'
            } else if (key.includes('facebook') || key.includes('instagram') || key.includes('twitter') || key.includes('linkedin')) {
                group = 'social'
            } else if (key.includes('hotel_')) {
                group = 'hotel'
            }

            return {
                key,
                value: String(value),
                type,
                group
            }
        })

        const result = await updateSettings(settingsArray)
        setLoading(false)

        if (result.success) {
            alert('Settings updated successfully!')
            router.refresh()
        } else {
            alert(result.message)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Tabs defaultValue="hotel" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="hotel">Hotel Info</TabsTrigger>
                    <TabsTrigger value="booking">Booking</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                </TabsList>

                {/* Hotel Information */}
                <TabsContent value="hotel">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hotel Information</CardTitle>
                            <CardDescription>Basic information about your hotel</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="hotel_name">Hotel Name</Label>
                                <Input
                                    id="hotel_name"
                                    value={settings.hotel_name}
                                    onChange={(e) => setSettings({ ...settings, hotel_name: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="hotel_address">Address</Label>
                                <Input
                                    id="hotel_address"
                                    value={settings.hotel_address}
                                    onChange={(e) => setSettings({ ...settings, hotel_address: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="hotel_phone">Phone Number</Label>
                                    <Input
                                        id="hotel_phone"
                                        type="tel"
                                        value={settings.hotel_phone}
                                        onChange={(e) => setSettings({ ...settings, hotel_phone: e.target.value })}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="hotel_email">Email Address</Label>
                                    <Input
                                        id="hotel_email"
                                        type="email"
                                        value={settings.hotel_email}
                                        onChange={(e) => setSettings({ ...settings, hotel_email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="hotel_description">Description</Label>
                                <Textarea
                                    id="hotel_description"
                                    rows={4}
                                    value={settings.hotel_description}
                                    onChange={(e) => setSettings({ ...settings, hotel_description: e.target.value })}
                                    placeholder="Brief description of your hotel..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Booking Settings */}
                <TabsContent value="booking">
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Settings</CardTitle>
                            <CardDescription>Configure booking rules and policies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="check_in_time">Check-in Time</Label>
                                    <Input
                                        id="check_in_time"
                                        type="time"
                                        value={settings.check_in_time}
                                        onChange={(e) => setSettings({ ...settings, check_in_time: e.target.value })}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="check_out_time">Check-out Time</Label>
                                    <Input
                                        id="check_out_time"
                                        type="time"
                                        value={settings.check_out_time}
                                        onChange={(e) => setSettings({ ...settings, check_out_time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="max_advance_days">Maximum Advance Booking (days)</Label>
                                    <Input
                                        id="max_advance_days"
                                        type="number"
                                        value={settings.max_advance_days}
                                        onChange={(e) => setSettings({ ...settings, max_advance_days: e.target.value })}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="min_stay_duration">Minimum Stay Duration (nights)</Label>
                                    <Input
                                        id="min_stay_duration"
                                        type="number"
                                        value={settings.min_stay_duration}
                                        onChange={(e) => setSettings({ ...settings, min_stay_duration: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                                <Textarea
                                    id="cancellation_policy"
                                    rows={3}
                                    value={settings.cancellation_policy}
                                    onChange={(e) => setSettings({ ...settings, cancellation_policy: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payment Settings */}
                <TabsContent value="payment">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Settings</CardTitle>
                            <CardDescription>Configure tax, charges, and currency</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                                    <Input
                                        id="tax_rate"
                                        type="number"
                                        step="0.01"
                                        value={settings.tax_rate}
                                        onChange={(e) => setSettings({ ...settings, tax_rate: e.target.value })}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="service_charge">Service Charge (%)</Label>
                                    <Input
                                        id="service_charge"
                                        type="number"
                                        step="0.01"
                                        value={settings.service_charge}
                                        onChange={(e) => setSettings({ ...settings, service_charge: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="currency">Currency Code</Label>
                                    <Input
                                        id="currency"
                                        value={settings.currency}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                        placeholder="e.g., NGN, USD"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="currency_symbol">Currency Symbol</Label>
                                    <Input
                                        id="currency_symbol"
                                        value={settings.currency_symbol}
                                        onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                                        placeholder="e.g., ₦, $"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Settings */}
                <TabsContent value="email">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email & Notifications</CardTitle>
                            <CardDescription>Manage email notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="admin_notification_email">Admin Notification Email</Label>
                                <Input
                                    id="admin_notification_email"
                                    type="email"
                                    value={settings.admin_notification_email}
                                    onChange={(e) => setSettings({ ...settings, admin_notification_email: e.target.value })}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Email address to receive booking notifications
                                </p>
                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label htmlFor="enable_booking_emails">Booking Confirmation Emails</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send confirmation emails to guests
                                    </p>
                                </div>
                                <Switch
                                    id="enable_booking_emails"
                                    checked={settings.enable_booking_emails}
                                    onCheckedChange={(checked) => setSettings({ ...settings, enable_booking_emails: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label htmlFor="enable_cancellation_emails">Cancellation Emails</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send emails when bookings are cancelled
                                    </p>
                                </div>
                                <Switch
                                    id="enable_cancellation_emails"
                                    checked={settings.enable_cancellation_emails}
                                    onCheckedChange={(checked) => setSettings({ ...settings, enable_cancellation_emails: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Media */}
                <TabsContent value="social">
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Media Links</CardTitle>
                            <CardDescription>Add your social media profile URLs</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="facebook_url">Facebook URL</Label>
                                <Input
                                    id="facebook_url"
                                    type="url"
                                    value={settings.facebook_url}
                                    onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                                    placeholder="https://facebook.com/yourpage"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="instagram_url">Instagram URL</Label>
                                <Input
                                    id="instagram_url"
                                    type="url"
                                    value={settings.instagram_url}
                                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                    placeholder="https://instagram.com/yourpage"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="twitter_url">Twitter URL</Label>
                                <Input
                                    id="twitter_url"
                                    type="url"
                                    value={settings.twitter_url}
                                    onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                                    placeholder="https://twitter.com/yourpage"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                <Input
                                    id="linkedin_url"
                                    type="url"
                                    value={settings.linkedin_url}
                                    onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                                    placeholder="https://linkedin.com/company/yourpage"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-6">
                <Button type="submit" disabled={loading} size="lg">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save All Settings
                </Button>
            </div>
        </form>
    )
}
