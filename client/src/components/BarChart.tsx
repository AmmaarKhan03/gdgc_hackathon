// src/components/GymTrafficChart.tsx
import * as React from "react";
import {BarChart} from "@mui/x-charts/BarChart";
import {chartsGridClasses} from "@mui/x-charts/ChartsGrid";
import {Card, CardContent} from "@/components/ui/card";

const OPEN_HOUR = 5;   // 5 AM
const CLOSE_HOUR = 23; // 11 PM

// simple 12h label: 5 -> "5 AM", 13 -> "1 PM"
const hourLabel = (h: number) => {
    const ampm = h < 12 ? "AM" : "PM";
    const hour12 = ((h + 11) % 12) + 1;
    return `${hour12} ${ampm}`;
};

// fake occupancy curve with morning & evening peaks
const occupancyAt = (h: number) => {
    const gaussian = (x: number, mu: number, sigma: number) =>
        Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));

    // morning ~8 AM, evening ~6:30 PM; scale to seat counts
    const base =
        30 * gaussian(h, 8, 1.2) + // morning peak
        45 * gaussian(h, 18.5, 1.5); // evening peak

    const low = 6 * gaussian(h, 12.5, 2.5); // small noon bump
    const floor = 4; // minimum trickle
    const noise = (Math.random() - 0.5) * 4; // tiny jitter
    return Math.max(0, Math.round(base + low + floor + noise));
};

export default function GymTrafficChart() {
    const now = new Date();
    const currentHour = now.getHours(); // 0–23

    // hours array 5…23
    const hours = Array.from(
        {length: CLOSE_HOUR - OPEN_HOUR + 1},
        (_, i) => OPEN_HOUR + i
    );

    // dataset rows
    const dataset = hours.map((h) => {
        const count = occupancyAt(h);
        const isNow = h === currentHour;
        return {
            hour: hourLabel(h),
            count,
            now: isNow ? count : null, // highlight bar only for current hour
        };
    });

    const todayName = new Intl.DateTimeFormat(undefined, {
        weekday: "long",
    }).format(now);

    const nowRow = dataset.find((r) => r.now !== null);
    const nowCount = nowRow?.now ?? 0;

    const valueFormatter = (v: number | null) =>
        v == null ? "" : `${v} students`;

    return (
        <div className="w-full overflow-x-auto">
            <Card className="max-w-full">
                <CardContent className="p-4">
                <div style={{marginBottom: 8}}>
                    <strong>{todayName}</strong> — Now:{" "}
                    <span style={{fontVariantNumeric: "tabular-nums"}}>{nowCount}</span>{" "}
                    students
                </div>

                    <div className="min-w-[900px]">
                <BarChart
                    dataset={dataset}
                    xAxis={[
                        {
                            dataKey: "hour",
                            scaleType: "band",
                            tickPlacement: "middle",
                            tickLabelPlacement: "middle",
                        },
                    ]}
                    yAxis={[{min: 0, max: 100}]}
                    series={[
                        {
                            dataKey: "count",
                            label: "Estimated hourly traffic",
                            valueFormatter,
                        },
                        {
                            dataKey: "now",
                            label: "Current hour",
                            valueFormatter,
                            color: "#3b82f6", // accent for "now" bar
                        },
                    ]}
                    grid={{horizontal: true}}
                    sx={{
                        [`& .${chartsGridClasses.line}`]: {
                            strokeDasharray: "5 3",
                            strokeWidth: 2,
                        },
                    }}
                    width={900}
                    height={420}
                />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
