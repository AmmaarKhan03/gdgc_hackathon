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
        current: {label: "Current", color: "#e5e7eb"},
        capacity: {label: "Capacity", color: "#ef4444"},
    }

    const data = [
        {key: "remaining", value: remaining, fill: "var(--color-remaining)"},
        {key: "current", value: current, fill: "var(--color-current)"},
    ]

    return (
        <Card className={`h-full shadow-sm border rounded-lg flex flex-col min-h-[160px] ${className}`}>
            <CardHeader className="pb-1">
                <CardTitle className="text-lg text-center">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36"
                >
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />}/>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="key"
                            cx="50%"
                            cy="50%"
                            innerRadius="85%"
                            outerRadius="100%"
                            startAngle={90}
                            endAngle={450}
                            strokeWidth={6}
                            isAnimationActive={false}
                        >
                            <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
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
            </CardContent>
        </Card>
    )
}