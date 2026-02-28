"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, DollarSign, Calendar, Star, Download, Activity } from "lucide-react"

export default function AnalyticsPage() {
  // Sample data for charts
  const revenueData = [
    { month: "Jan", revenue: 45000000, bookings: 120 },
    { month: "Feb", revenue: 52000000, bookings: 140 },
    { month: "Mar", revenue: 48000000, bookings: 130 },
    { month: "Apr", revenue: 61000000, bookings: 165 },
    { month: "May", revenue: 55000000, bookings: 150 },
    { month: "Jun", revenue: 67000000, bookings: 180 },
    { month: "Jul", revenue: 72000000, bookings: 195 },
    { month: "Aug", revenue: 69000000, bookings: 185 },
    { month: "Sep", revenue: 58000000, bookings: 155 },
    { month: "Oct", revenue: 63000000, bookings: 170 },
    { month: "Nov", revenue: 71000000, bookings: 190 },
    { month: "Dec", revenue: 78000000, bookings: 210 },
  ]

  const roomTypeData = [
    { name: "Deluxe Room", value: 45, revenue: 38250000 },
    { name: "Executive Suite", value: 30, revenue: 45000000 },
    { name: "Presidential Suite", value: 15, revenue: 45000000 },
    { name: "Business Room", value: 10, revenue: 12000000 },
  ]

  const occupancyData = [
    { date: "2024-01-01", occupancy: 75 },
    { date: "2024-01-02", occupancy: 82 },
    { date: "2024-01-03", occupancy: 78 },
    { date: "2024-01-04", occupancy: 85 },
    { date: "2024-01-05", occupancy: 90 },
    { date: "2024-01-06", occupancy: 88 },
    { date: "2024-01-07", occupancy: 92 },
  ]

  const customerSatisfactionData = [
    { rating: "5 Stars", count: 450, percentage: 65 },
    { rating: "4 Stars", count: 180, percentage: 26 },
    { rating: "3 Stars", count: 45, percentage: 6 },
    { rating: "2 Stars", count: 15, percentage: 2 },
    { rating: "1 Star", count: 5, percentage: 1 },
  ]

  const COLORS = ["#0891b2", "#7c3aed", "#059669", "#dc2626", "#ea580c"]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Reports</h1>
            <p className="text-muted-foreground">Comprehensive insights into hotel performance</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="30days">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦639M</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.3%</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,950</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.1% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.6</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.2 from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
            <TabsTrigger value="rooms">Room Types</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Bookings Trend</CardTitle>
                <CardDescription>Monthly revenue and booking statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "revenue" ? `₦${(Number(value) / 1000000).toFixed(1)}M` : value,
                        name === "revenue" ? "Revenue" : "Bookings",
                      ]}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0891b2"
                      fill="#0891b2"
                      fillOpacity={0.3}
                      name="Revenue"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="bookings"
                      stroke="#7c3aed"
                      strokeWidth={3}
                      name="Bookings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="occupancy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Rate Trend</CardTitle>
                <CardDescription>Daily occupancy rates for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Occupancy Rate"]} />
                    <Line
                      type="monotone"
                      dataKey="occupancy"
                      stroke="#0891b2"
                      strokeWidth={3}
                      dot={{ fill: "#0891b2", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Room Type Distribution</CardTitle>
                  <CardDescription>Booking distribution by room type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={roomTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {roomTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Room Type</CardTitle>
                  <CardDescription>Revenue contribution by room category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={roomTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₦${(Number(value) / 1000000).toFixed(1)}M`, "Revenue"]} />
                      <Bar dataKey="revenue" fill="#0891b2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="satisfaction" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Satisfaction</CardTitle>
                  <CardDescription>Rating distribution from guest reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={customerSatisfactionData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="rating" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0891b2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rating Breakdown</CardTitle>
                  <CardDescription>Detailed satisfaction metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customerSatisfactionData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.rating}</Badge>
                        <span className="text-sm text-muted-foreground">{item.count} reviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                        </div>
                        <span className="text-sm font-medium">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Months</CardTitle>
              <CardDescription>Highest revenue months</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {revenueData
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 3)
                .map((month, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{month.month}</span>
                    <span className="text-primary font-bold">₦{(month.revenue / 1000000).toFixed(1)}M</span>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
              <CardDescription>Key booking insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Average Stay Duration</span>
                <Badge>2.3 nights</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Repeat Customers</span>
                <Badge>34%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Advance Booking</span>
                <Badge>18 days</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Goals</CardTitle>
              <CardDescription>Monthly targets vs actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Revenue Target</span>
                  <span>87%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "87%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Occupancy Target</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Satisfaction Target</span>
                  <span>96%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "96%" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
