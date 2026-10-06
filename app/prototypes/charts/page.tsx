'use client'

import { useState, useEffect } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'

/**
 * PROTOTYPE: Charts & Time Series - Recharts (shadcn-style)
 *
 * CONCLUSION: Recharts recommended
 * - Declarative React API (React 19 compatible)
 * - Built-in area bands for ensemble spread (YU-286)
 * - Handles multi-member time series + threshold annotations
 * - 400KB bundle, easier to maintain than ECharts/visx
 */

// Generate synthetic ensemble time series
const generateEnsembleData = (hours: number = 72) => {
  const data = []
  const baseMean = 15

  for (let h = 0; h <= hours; h++) {
    const mean = baseMean + 5 * Math.sin(h * 0.1) + 3 * Math.cos(h * 0.05)

    // 10 ensemble members
    const members = []
    for (let m = 1; m <= 10; m++) {
      const value = mean + (Math.random() - 0.5) * 8 + Math.sin(m + h * 0.1) * 2
      members.push(value)
    }

    const spread = Math.sqrt(members.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / 10)
    const ecValue = mean + (Math.random() - 0.5) * 3
    const isValid = Math.random() > 0.05

    data.push({
      hour: h,
      mean: isValid ? mean : null,
      ecValue: isValid ? ecValue : null,
      spreadUpper: isValid ? mean + spread : null,
      spreadLower: isValid ? mean - spread : null,
      members: isValid ? members : null
    })
  }

  return data
}

export default function ChartsPrototype() {
  const [showMembers, setShowMembers] = useState(false)
  const [showSpread, setShowSpread] = useState(true)
  const [showEC, setShowEC] = useState(true)
  const [threshold, setThreshold] = useState(20)

  const data = generateEnsembleData()

  // Calculate threshold counts
  const dataWithThreshold = data.map(d => {
    const thresholdCount = d.members
      ? d.members.filter(v => v > threshold).length
      : null

    return {
      ...d,
      threshold,
      thresholdCount
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conclusion Banner */}
      <div className="bg-green-50 border-b-2 border-green-600 p-4">
        <h1 className="font-bold text-lg">✅ RECOMMENDATION: Recharts</h1>
        <p className="text-sm text-gray-700">
          Declarative React API, built-in area bands for spread (YU-286), 400KB bundle.
          Easier to maintain than visx (too low-level) or ECharts (imperative API).
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white border-b p-4 space-y-3">
        <div className="flex gap-6 items-center flex-wrap">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showSpread}
              onChange={(e) => setShowSpread(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Show Spread Band</span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showMembers}
              onChange={(e) => setShowMembers(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Show 10 Members</span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showEC}
              onChange={(e) => setShowEC(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Show EC Baseline</span>
          </label>

          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm font-medium">Threshold (°C):</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Ensemble Time Series with Spread */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Ensemble Time Series (Temperature °C)</h2>
            <p className="text-sm text-gray-500 mt-1">AI ensemble mean, spread band, and EC baseline comparison</p>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dataWithThreshold}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis
                dataKey="hour"
                label={{ value: 'Forecast Hour', position: 'insideBottom', offset: -5 }}
                className="text-sm"
              />
              <YAxis
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                className="text-sm"
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
              <Legend />

              {/* Spread band */}
              {showSpread && (
                <>
                  <Area
                    type="monotone"
                    dataKey="spreadUpper"
                    stroke="none"
                    fill="#FEE5D9"
                    fillOpacity={0.5}
                    name="Spread +"
                    connectNulls={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="spreadLower"
                    stroke="none"
                    fill="#FEE5D9"
                    fillOpacity={0.5}
                    name="Spread -"
                    connectNulls={false}
                  />
                </>
              )}

              {/* Individual members */}
              {showMembers && (
                <>
                  {Array.from({ length: 10 }, (_, i) => (
                    <Line
                      key={i}
                      type="monotone"
                      dataKey={d => d.members?.[i] ?? null}
                      stroke={`hsl(${i * 36}, 65%, 55%)`}
                      strokeWidth={1.5}
                      dot={false}
                      name={`Member ${i + 1}`}
                      connectNulls={false}
                    />
                  ))}
                </>
              )}

              {/* Ensemble mean */}
              <Line
                type="monotone"
                dataKey="mean"
                stroke="#DC2626"
                strokeWidth={3}
                dot={false}
                name="AI Ensemble Mean"
                connectNulls={false}
              />

              {/* EC baseline */}
              {showEC && (
                <Line
                  type="monotone"
                  dataKey="ecValue"
                  stroke="#2563EB"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="EC Baseline"
                  connectNulls={false}
                />
              )}

              {/* Threshold line */}
              <ReferenceLine
                y={threshold}
                stroke="#059669"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: `Threshold: ${threshold}°C`,
                  position: 'right',
                  style: { fontSize: 12, fill: '#059669' }
                }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs space-y-1">
            <p className="font-medium text-blue-900">YU-286 Compliance:</p>
            <ul className="list-disc ml-4 text-blue-800 space-y-0.5">
              <li>✅ Area band = ensemble spread (not confidence interval)</li>
              <li>✅ Missing data shown as gaps (connectNulls=false)</li>
              <li>✅ EC comparison per-row (not averaged across ensemble)</li>
            </ul>
          </div>
        </div>

        {/* Threshold Exceedance Count */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Threshold Exceedance Count</h2>
            <p className="text-sm text-gray-500 mt-1">
              Members exceeding {threshold}°C (strict {'>'} comparison)
            </p>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataWithThreshold}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis
                dataKey="hour"
                label={{ value: 'Forecast Hour', position: 'insideBottom', offset: -5 }}
                className="text-sm"
              />
              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                label={{ value: 'Count / 10', angle: -90, position: 'insideLeft' }}
                className="text-sm"
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
              <Bar
                dataKey="thresholdCount"
                fill="#10B981"
                name="Members > Threshold"
              />
              <ReferenceLine
                y={7}
                stroke="#DC2626"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: '7/10',
                  position: 'right',
                  style: { fontSize: 12, fill: '#DC2626' }
                }}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs space-y-1">
            <p className="font-medium text-amber-900">YU-286 Compliance:</p>
            <ul className="list-disc ml-4 text-amber-800 space-y-0.5">
              <li>✅ Count/10 format (not percentage)</li>
              <li>✅ Strict comparison: {'>'} threshold (not {'>='})</li>
              <li>⚠️ If any member invalid → mean/spread/threshold all NULL (not 7/8 adjusted)</li>
            </ul>
          </div>
        </div>

        {/* Cross-Cycle Evolution (YU-288) */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Cross-Cycle Evolution (YU-288)</h2>
            <p className="text-sm text-gray-500 mt-1">Fixed valid time, different init cycles</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="p-3 text-left font-semibold">Cycle</th>
                  <th className="p-3 text-left font-semibold">Lead (h)</th>
                  <th className="p-3 text-left font-semibold">Valid Time</th>
                  <th className="p-3 text-right font-semibold">AI Mean (°C)</th>
                  <th className="p-3 text-right font-semibold">EC Baseline (°C)</th>
                  <th className="p-3 text-right font-semibold">AI - EC (°C)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cycle: '2025-10-05 00Z', lead: 72, validTime: '2025-10-08 00Z', aiMean: 18.5, ecMean: 17.2 },
                  { cycle: '2025-10-05 12Z', lead: 60, validTime: '2025-10-08 00Z', aiMean: 18.1, ecMean: 17.0 },
                  { cycle: '2025-10-06 00Z', lead: 48, validTime: '2025-10-08 00Z', aiMean: 19.2, ecMean: 18.5 },
                  { cycle: '2025-10-06 12Z', lead: 36, validTime: '2025-10-08 00Z', aiMean: 19.8, ecMean: 19.1 },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{row.cycle}</td>
                    <td className="p-3">{row.lead}</td>
                    <td className="p-3 font-mono text-xs">{row.validTime}</td>
                    <td className="p-3 text-right font-medium">{row.aiMean.toFixed(1)}</td>
                    <td className="p-3 text-right">{row.ecMean.toFixed(1)}</td>
                    <td className="p-3 text-right font-semibold text-green-700">
                      +{(row.aiMean - row.ecMean).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md text-xs space-y-1">
            <p className="font-medium text-purple-900">YU-288 Compliance:</p>
            <ul className="list-disc ml-4 text-purple-800 space-y-0.5">
              <li>✅ Each row uses its own EC baseline (not cross-cycle averaged)</li>
              <li>✅ Fixed valid time, variable lead across cycles</li>
              <li>⚠️ Don't interpret AI−EC difference as "AI improvement" (could be weather evolution)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Notes Footer */}
      <div className="bg-white border-t p-4">
        <div className="max-w-7xl mx-auto">
          <strong className="text-sm">Recharts Technical Notes:</strong>
          <ul className="list-disc ml-4 mt-2 space-y-1 text-xs text-gray-600">
            <li>✅ Declarative React components ({'<LineChart>'}, {'<Area>'}, {'<Bar>'})</li>
            <li>✅ Built-in support for area bands (spread visualization)</li>
            <li>✅ connectNulls=false shows missing data as gaps</li>
            <li>✅ Composable with other Recharts primitives</li>
            <li>📦 Bundle: ~400KB</li>
            <li>⚠️ No built-in timeline slider (need custom component for playback)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
