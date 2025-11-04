"use client"

import * as React from "react"
import {Label, Pie, PieChart} from "recharts"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"

interface chartProps {
    current: number
    capacity: number
    title?: string
    className?: string
}

export default function CapacityPieChart({
                                             current,
                                             capacity,
                                             title = "Capacity",
                                             className = "",
                                         }: chartProps) {

    const remaining = Math.max(capacity - current, 0);
    const percent = Math.floor((current / Math.max(capacity, 1)) * 100);

    const chartConfig: ChartConfig = {
        available: {label: "Current Use", color: "#ef4444"},
        current: {label: "Available Space", color: "#e5e7eb"},
    }

    const data = [
        {key: "current", value: remaining, fill: "var(--color-current)"},
        {key: "available", value: current, fill: "var(--color-available)"},
    ]

    return (
        <Card className={`h-full shadow-sm border rounded-lg flex flex-col min-h-[160px] ${className}`}>
            <CardHeader className="pb-1">
                <CardTitle className="text-lg text-center">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-between">
                {/* Chart area */}
                <ChartContainer
                    config={chartConfig}
                    className="aspect-square w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36"
                >
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel/>}/>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="key"
                            cx="50%"
                            cy="50%"
                            innerRadius="70%"
                            outerRadius="100%"
                            startAngle={90}
                            endAngle={450}
                            strokeWidth={5}
                            isAnimationActive={false}
                        >
                            <Label
                                content={({viewBox}) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-xl font-bold"
                                                >
                                                    {percent}%
                                                </tspan>
                                            </text>
                                        )
                                    }
                                    return null
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>

                <div className="mt-5 flex items-center justify-center gap-6 text-sm">
                    {(["current", "available"] as const).map((key) => (
                        <div key={key} className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium">
                                {chartConfig[key].label}
                            </span>
                            -
                            <span
                                className="inline-block w-4 h-4 rounded-full"
                                style={{ backgroundColor: chartConfig[key].color }}
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}