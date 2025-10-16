import * as React from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';

export default function BarChartDemo() {
    const dataSet = [
        { month: 'Monday', seoul: 100 },
        { month: 'Tuesday', seoul: 120 },
        { month: 'Wednesday', seoul: 60 },
        { month: 'Thursday', seoul: 100 },
        { month: 'Friday', seoul: 150 },
        { month: 'Saturday', seoul: 200 },
        { month: 'Sunday', seoul: 320 },
    ];

    const valueFormatter = (value: number) => `${value} mm`;

    return (
        <BarChart
            dataset={dataSet}
            xAxis={[{dataKey: 'month'}]}
            series={[{ dataKey: 'seoul', label: 'Seoul rainfall', valueFormatter }]}
            grid={{ horizontal: true }}
            sx={{
                [`& .${chartsGridClasses.line}`]: {
                    strokeDasharray: '5 3',
                    strokeWidth: 2,
                },
            }}
            width={600}
            height={400}
        />
    )
}