import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const weightRates = {
  '500GM': {
    'Intra-city': 75,
    'Intra-Region': 92,
    'Metro*': 105,
    'Rest of India': 109,
    'Rest of India - ROS': 115,
    'J&K, NE, Andaman': 129,
    'J&K, NE, Andman - ROS': 136,
    'SDL Locations': 170,
  },
  '1KG': {
    'Intra-city': 98,
    'Intra-Region': 129,
    'Metro*': 159,
    'Rest of India': 170,
    'Rest of India - ROS': 176,
    'J&K, NE, Andaman': 214,
    'J&K, NE, Andman - ROS': 221,
    'SDL Locations': 339,
  },
  // ... other weight rates
};

const surfaceRates = {
  'For the 1st Slab': {
    'Intra-city': 302,
    'Intra-Region': 339,
    'Metro*': 400,
    'Rest of India': 451,
    'Rest of India - ROS': 451,
    'J&K, NE, Andaman': 502,
    'J&K, NE, Andman - ROS': 502,
  },
  'For every additional Kg or part thereof': {
    'Intra-city': 54,
    'Intra-Region': 61,
    'Metro*': 71,
    'Rest of India': 81,
    'Rest of India - ROS': 81,
    'J&K, NE, Andaman': 88,
    'J&K, NE, Andman - ROS': 88,
  },
};

export default function Partner() {
  const [expandedType, setExpandedType] = useState(null);

  const toggleExpand = (carrierName) => {
    setExpandedType(expandedType === carrierName ? null : carrierName);
  };

  const renderRatesTable = (rates) => (
    <Table className="min-w-full mt-2">
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Weight/Slab</TableHead>
          {Object.keys(Object.values(rates)[0]).map((region) => (
            <TableHead key={region} className="text-center">{region}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(rates).map(([weight, regions]) => (
          <TableRow key={weight}>
            <TableCell className="font-medium">{weight}</TableCell>
            {Object.values(regions).map((rate, index) => (
              <TableCell key={index} className="text-center">₹{rate}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <CardContent>
      {/* Partner 1 */}
      <div className="mb-2 px-2 py-4 ">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleExpand('Partner A')}
        >
          <CardDescription className="font-semibold text-black text-xl">
            ECom 0.5 KG
          </CardDescription>
          <svg
            className={`w-6 h-6 transform transition-transform ${
              expandedType === 'Partner A' ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {expandedType === 'Partner A' && (
          <div className="mt-4">
            <p className="mb-2">Weight Rates:</p>
            <div className="overflow-x-auto custom-horizontal-scroll">
              {renderRatesTable(weightRates)}
            </div>
            <p className="mt-4 mb-2">Surface Rates:</p>
            <div className="overflow-x-auto custom-horizontal-scroll">
              {renderRatesTable(surfaceRates)}
            </div>
          </div>
        )}
      </div>

      {/* Partner 2 */}
      <div className="mb-4 px-2 py-4 rounded-lg bg-gray-50">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleExpand('Partner B')}
        >
          <CardDescription className="font-semibold text-black text-xl">
            ECom 5 KG
          </CardDescription>
          <svg
            className={`w-6 h-6 transform transition-transform ${
              expandedType === 'Partner B' ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {expandedType === 'Partner B' && (
          <div className="mt-4">
            <p className="mb-2">Weight Rates:</p>
            <div className="overflow-x-auto custom-horizontal-scroll">
              {renderRatesTable(weightRates)}
            </div>
            <p className="mt-4 mb-2">Surface Rates:</p>
            <div className="overflow-x-auto custom-horizontal-scroll">
              {renderRatesTable(surfaceRates)}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
}