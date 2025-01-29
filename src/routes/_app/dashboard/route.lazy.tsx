import React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
// For charts
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

/**
 * Dummy data for charts
 */
const propertyData = [
  { month: 'Jan', properties: 10 },
  { month: 'Feb', properties: 30 },
  { month: 'Mar', properties: 20 },
  { month: 'Apr', properties: 40 },
  { month: 'May', properties: 35 },
  { month: 'Jun', properties: 45 },
]

const hrData = [
  { month: 'Jan', employees: 35, openPositions: 5 },
  { month: 'Feb', employees: 38, openPositions: 6 },
  { month: 'Mar', employees: 40, openPositions: 4 },
  { month: 'Apr', employees: 42, openPositions: 6 },
  { month: 'May', employees: 44, openPositions: 5 },
  { month: 'Jun', employees: 45, openPositions: 7 },
]

export const Route = createLazyFileRoute('/_app/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="mb-6 text-2xl font-bold text-gray-700">
        Real Estate & HR ERP Dashboard
      </h1>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-gray-500">Total Properties</h2>
          <p className="mt-2 text-2xl font-semibold text-gray-800">150</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-gray-500">Occupied Units</h2>
          <p className="mt-2 text-2xl font-semibold text-gray-800">120</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-gray-500">Employees</h2>
          <p className="mt-2 text-2xl font-semibold text-gray-800">42</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-gray-500">Open Positions</h2>
          <p className="mt-2 text-2xl font-semibold text-gray-800">6</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-700">
            Properties by Month
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="properties" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-700">
            Employees & Open Positions
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hrData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="employees" stroke="#10B981" />
                <Line type="monotone" dataKey="openPositions" stroke="#EF4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
{/* Recent Activities & Employee Table Section */}
<div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
  {/* Recent Activity Card */}
  <div className="col-span-1 rounded-lg bg-white p-4 shadow-sm">
    <h2 className="text-lg font-semibold text-gray-700">Recent Activities</h2>
    <ul className="mt-4 space-y-2 text-gray-600">
      <li>
        <span className="font-medium">Fares Hassan</span> developed a secure and scalable backend API using <strong>FastAPI</strong> and <strong>Python</strong> for Real Estate and HR management.
      </li>
      <li>
        <span className="font-medium">Fares Hassan</span> designed and implemented a modern front-end interface with <strong>React</strong> and <strong>Tailwind CSS</strong>, utilizing <strong>TanStack</strong> for state and data management.
      </li>
      <li>
        <span className="font-medium">Fares Hassan</span> seamlessly integrated the backend with the frontend for real-time data flow and dynamic updates.
      </li>
      <li>
        <span className="font-medium">Fares Hassan</span> created interactive dashboards and visualizations to enhance user experience.
      </li>
    </ul>
  </div>

  {/* Employees Table */}
  <div className="col-span-1 rounded-lg bg-white p-4 shadow-sm lg:col-span-2">
    <h2 className="mb-4 text-lg font-semibold text-gray-700">Employees</h2>
    <div className="overflow-x-auto">
      <table className="w-full min-w-max divide-y divide-gray-200 text-left text-sm text-gray-600">
        <thead>
          <tr>
            <th className="py-2 px-3 font-medium text-gray-700">Name</th>
            <th className="py-2 px-3 font-medium text-gray-700">Position</th>
            <th className="py-2 px-3 font-medium text-gray-700">Department</th>
            <th className="py-2 px-3 font-medium text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="py-2 px-3">John Doe</td>
            <td className="py-2 px-3">Project Manager</td>
            <td className="py-2 px-3">Real Estate</td>
            <td className="py-2 px-3">
              <span className="rounded bg-green-100 px-2 py-1 text-green-800">
                Active
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-2 px-3">Jane Smith</td>
            <td className="py-2 px-3">HR Specialist</td>
            <td className="py-2 px-3">HR</td>
            <td className="py-2 px-3">
              <span className="rounded bg-green-100 px-2 py-1 text-green-800">
                Active
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-2 px-3">Michael Johnson</td>
            <td className="py-2 px-3">Sales Manager</td>
            <td className="py-2 px-3">Real Estate</td>
            <td className="py-2 px-3">
              <span className="rounded bg-yellow-100 px-2 py-1 text-yellow-800">
                On Leave
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-2 px-3">Emily Davis</td>
            <td className="py-2 px-3">Accountant</td>
            <td className="py-2 px-3">Finance</td>
            <td className="py-2 px-3">
              <span className="rounded bg-red-100 px-2 py-1 text-red-800">
                Inactive
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>


      {/* Footer or any other content */}
      <div className="mt-8 text-center text-sm text-gray-500">
        © 2025 Example Real Estate & HR ERP. All rights reserved.
      </div>
    </div>
  )
}
