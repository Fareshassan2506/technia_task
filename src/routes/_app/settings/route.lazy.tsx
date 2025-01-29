import React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="mb-8 text-3xl font-bold text-gray-700">Settings</h1>

      <div className="space-y-10">
        {/* General Settings */}
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-gray-700">
            General Settings
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Application Theme */}
            <div className="flex flex-col p-4 rounded-md bg-white shadow-sm border border-gray-200">
              <label
                htmlFor="theme"
                className="mb-2 text-sm font-bold text-gray-700"
              >
                Application Theme
              </label>
              <select
                id="theme"
                className="rounded border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            {/* Language */}
            <div className="flex flex-col p-4 rounded-md bg-white shadow-sm border border-gray-200">
              <label
                htmlFor="language"
                className="mb-2 text-sm font-bold text-gray-700"
              >
                Language
              </label>
              <select
                id="language"
                className="rounded border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="fr">French</option>
              </select>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center p-4 rounded-md bg-white shadow-sm border border-gray-200">
              <input
                type="checkbox"
                id="notifications"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
              <label
                htmlFor="notifications"
                className="ml-3 text-sm font-bold text-gray-700"
              >
                Enable Notifications
              </label>
            </div>

            {/* Time Zone */}
            <div className="flex flex-col p-4 rounded-md bg-white shadow-sm border border-gray-200">
              <label
                htmlFor="timezone"
                className="mb-2 text-sm font-bold text-gray-700"
              >
                Time Zone
              </label>
              <select
                id="timezone"
                className="rounded border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="UTC">UTC</option>
                <option value="Cairo">Cairo (UTC+2)</option>
                <option value="New York">New York (UTC-5)</option>
                <option value="London">London (UTC+0)</option>
                <option value="Tokyo">Tokyo (UTC+9)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Real Estate Settings */}
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-gray-700">
            Real Estate Settings
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Default Currency */}
            <div className="flex flex-col p-4 rounded-md bg-white shadow-sm border border-gray-200">
              <label
                htmlFor="currency"
                className="mb-2 text-sm font-bold text-gray-700"
              >
                Default Currency
              </label>
              <select
                id="currency"
                className="rounded border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="USD">USD</option>
                <option value="EGP">EGP</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            {/* Property Listing Visibility */}
            <div className="flex flex-col p-4 rounded-md bg-white shadow-sm border border-gray-200">
              <label
                htmlFor="property-visibility"
                className="mb-2 text-sm font-bold text-gray-700"
              >
                Property Listing Visibility
              </label>
              <select
                id="property-visibility"
                className="rounded border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="public">Public</option>
                <option value="internal">Internal</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </section>

        {/* HR Settings */}
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-gray-700">HR Settings</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Employee Onboarding Toggle */}
            <div className="flex items-center p-4 rounded-md bg-white shadow-sm border border-gray-200">
              <input
                type="checkbox"
                id="onboarding"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
              <label
                htmlFor="onboarding"
                className="ml-3 text-sm font-bold text-gray-700"
              >
                Enable Employee Onboarding
              </label>
            </div>

            {/* Payroll Start Day */}
            <div className="flex flex-col p-4 rounded-md bg-white shadow-sm border border-gray-200">
              <label
                htmlFor="payroll-day"
                className="mb-2 text-sm font-bold text-gray-700"
              >
                Payroll Start Day
              </label>
              <select
                id="payroll-day"
                className="rounded border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="1">1st of the month</option>
                <option value="15">15th of the month</option>
                <option value="20">20th of the month</option>
              </select>
            </div>
          </div>
        </section>

        {/* Save or Update Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md bg-black px-6 py-3 text-white shadow-lg hover:bg-neutral-600"
            onClick={() => alert('Settings saved (dummy action)!')}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
