"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import { useState } from "react";

const apiDocs = [
  {
    id: "getOrders",
    title: "Get Orders",
    method: "GET",
    endpoint: "/orders",
    description: "Fetches a list of all orders placed by customers.",
    requestExample: `fetch('/orders', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
}).then(res => res.json()).then(data => console.log(data));`,
    responseExample: `{
  "orders": [
    { "id": 1, "item": "Burger", "quantity": 2 },
    { "id": 2, "item": "Pizza", "quantity": 1 }
  ]
}`,
  },
  {
    id: "createOrder",
    title: "Create Order",
    method: "POST",
    endpoint: "/orders",
    description: "Creates a new order with the given details.",
    requestExample: `fetch('/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({ item: "Burger", quantity: 2 })
}).then(res => res.json()).then(data => console.log(data));`,
    responseExample: `{
  "success": true,
  "orderId": 123
}`,
  },
];

export default function ApiDoc({ setShowApiDoc }) {
  const [activeTab, setActiveTab] = useState(apiDocs[0].id);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
        <Button
          variant="outline"
          className="mt-8 flex items-center"
          onClick={() => setShowApiDoc(false)}
        >
          <ArrowLeftCircle className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <p className="text-gray-600 mb-6">
        Use the following endpoints to integrate our APIs into your application.
      </p>

      <div className="flex space-x-2 border-b pb-2">
        {apiDocs.map((api) => (
          <button
            key={api.id}
            className={`px-4 py-2 text-sm font-medium rounded-t ${
              activeTab === api.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab(api.id)}
          >
            {api.title}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {apiDocs.map((api) =>
          activeTab === api.id ? (
            <div key={api.id}>
              <p className="text-lg font-semibold mb-2">
                {api.method} {api.endpoint}
              </p>
              <p className="text-gray-600 mb-4">{api.description}</p>

              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Request Example:</p>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {api.requestExample}
                </pre>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Response Example:</p>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {api.responseExample}
                </pre>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
