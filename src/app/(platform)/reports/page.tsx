"use client"

import Link from "next/link"
import { BarChart3, CheckCircle, ExternalLink, LineChart, PieChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  const reportTypes = [
    {
      title: "Campaign Reports",
      description: "Comprehensive performance metrics for all your campaigns",
      icon: <BarChart3 className="size-8 text-primary" />,
      link: "/reports/campaign",
      metrics: ["Impressions", "Clicks", "Conversions", "ROI"],
    },
    {
      title: "Click Reports",
      description: "Detailed analysis of click performance and user engagement",
      icon: <ExternalLink className="size-8 text-primary" />,
      link: "/reports/clicks",
      metrics: ["Total Clicks", "Unique Clicks", "CTR", "CPC"],
    },
    {
      title: "Conversion Reports",
      description: "Track conversions, revenue, and return on investment",
      icon: <CheckCircle className="size-8 text-primary" />,
      link: "/reports/conversions",
      metrics: ["Conversions", "Revenue", "Conversion Rate", "ROI"],
    },
    {
      title: "Custom Reports",
      description: "Create customized reports with the metrics that matter to you",
      icon: <PieChart className="size-8 text-primary" />,
      link: "#",
      metrics: ["Custom Metrics", "Data Export", "Scheduled Reports", "Visualizations"],
      comingSoon: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Access detailed analytics and performance reports for your campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <LineChart className="mr-2 size-4" />
            Schedule Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Card key={report.title} className="flex flex-col">
            <CardHeader>
              <div className="mb-3">{report.icon}</div>
              <CardTitle className="flex items-center gap-2">
                {report.title}
                {report.comingSoon && (
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    Coming Soon
                  </span>
                )}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Key Metrics:</h4>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {report.metrics.map((metric) => (
                    <li key={metric} className="text-sm text-muted-foreground">
                      • {metric}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              {report.comingSoon ? (
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href={report.link}>View Reports</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Need Custom Reports?</CardTitle>
            <CardDescription>
              We can help you create custom reports tailored to your specific needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our team can work with you to develop custom reports that provide the exact insights you need for your business. 
              Contact us to discuss your requirements and we'll create a solution that works for you.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Contact Support</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
