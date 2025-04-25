import { useState } from 'react';
import {
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const expressPartner = {
  name: "Express Delhivery",
  codCharges: "2.25% or Rs. 60/- Whichever is higher",
  fuelSurcharge: "0%",
  rates: {
    "DTO Additional 500 gm till 5kg": [55, 72.5, 85, 95, 105, 107.5, 135, 147.5],
    "DTO Upto 5kgs": [647.5, 812.5, 912.5, 992.5, 1047.5, 1112.5, 1352.5, 1465],
    "DTO Addnl 1 kgs (5-10kg)": [65, 75, 95, 107.5, 120, 140, 155, 167.5],
    "DTO Upto10 kgs": [955, 1147.5, 1340, 1460, 1547.5, 1695, 1867.5, 1940],
    "DTO Addnl 1 kgs (post 10kg)": [67.5, 85, 92.5, 100, 105, 115, 127.5, 140],
  },
  expressRates: {
    "0-250 gm": [77.5, 90, 117.5, 127.5, 155, 172.5],
    "250-500 gm": [17.5, 22.5, 35, 47.5, 50, 60],
    "Additional 500 gm": [35, 45, 105, 117.5, 127.5, 145],
    "RTO 0-250 gm": [77.5, 90, 97.5, 102.5, 115, 130],
    "RTO 250-500 gm": [17.5, 22.5, 27.5, 32.5, 37.5, 42.5],
    "RTO Additional 500 gm": [35, 45, 60, 67.5, 85, 92.5],
    "DTO 0-250 gm": [125, 145, 155, 165, 185, 207.5],
    "DTO 250-500 gm": [27.5, 35, 45, 52.5, 60, 67.5],
    "DTO Additional 500 gm": [55, 72.5, 95, 107.5, 135, 147.5],
  },
};

const weightHeaders = ["Z1", "Z2", "Z3", "Z4", "Z5", "Z6", "Z7", "Z8"];
const expressHeaders = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F"];

export default function ExpressRateCards() {
  const [showRates, setShowRates] = useState(false);

  return (
    <CardContent className="space-y-4">
      <div className="px-2 py-4 rounded-lg bg-gray-50">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowRates(!showRates)}
        >
          <CardDescription className="font-semibold text-black text-xl">
            {expressPartner.name}
          </CardDescription>
          <svg
            className={`w-6 h-6 transform transition-transform ${
              showRates ? "rotate-180" : ""
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

        {showRates && (
          <div className="mt-4 space-y-6">
            <div>
              <p className="mb-2">
                COD Charges: {expressPartner.codCharges} | Fuel Surcharge: {expressPartner.fuelSurcharge}
              </p>
              <h4 className="font-semibold mb-2">Weight-based DTO Rates</h4>
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Slab</TableHead>
                      {weightHeaders.map((z) => (
                        <TableHead key={z}>{z}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(expressPartner.rates).map(([label, values]) => (
                      <TableRow key={label}>
                        <TableCell className="font-medium">{label}</TableCell>
                        {values.map((val, idx) => (
                          <TableCell key={idx}>{val}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Express Delivery Rate Card</h4>
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Slab Condition</TableHead>
                      {expressHeaders.map((zone) => (
                        <TableHead key={zone}>{zone}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(expressPartner.expressRates).map(([label, values]) => (
                      <TableRow key={label}>
                        <TableCell className="font-medium">{label}</TableCell>
                        {values.map((val, idx) => (
                          <TableCell key={idx}>{val}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
}
