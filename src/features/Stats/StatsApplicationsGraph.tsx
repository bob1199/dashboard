import * as React from 'react';
import { IStatsApplications } from '../../config';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';


interface IStatsApplicationsGraph {
    applications: Array<IStatsApplications>;
}

const StatsApplicationsGraph: React.FC<IStatsApplicationsGraph> = (props) => {
    const applications = props.applications;
    applications.reverse();

    // cannot use ResponsiveContainer since parent has no width and height
    return (
        <LineChart
            width={700}
            height={300}
            data={applications}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
                type="monotone"
                dataKey="applications"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
        </LineChart>
    );
}

export { StatsApplicationsGraph };
