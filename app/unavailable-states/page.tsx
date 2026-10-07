import {
  EmptyState,
  ErrorState,
  WithdrawnState,
  RestrictedState,
  NotAvailableState,
} from "@/components/ui/unavailable-states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnavailableStatesPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Unavailable State Components</h1>
        <p className="text-muted-foreground">
          Reusable components for common unavailable scenarios matching DESIGN.md message library.
        </p>
      </div>

      <Tabs defaultValue="empty" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="empty">Empty</TabsTrigger>
          <TabsTrigger value="error">Error</TabsTrigger>
          <TabsTrigger value="withdrawn">Withdrawn</TabsTrigger>
          <TabsTrigger value="restricted">Restricted</TabsTrigger>
          <TabsTrigger value="not-available">Not Available</TabsTrigger>
        </TabsList>

        <TabsContent value="empty" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>EmptyState - No Products in This Time Range</CardTitle>
              <CardDescription>
                Used when valid time has no published forecasts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                message="Valid time 2024-03-20 12:00 UTC has no published forecasts. Try a different time or check the Forecast Directory for available cycles."
                actionLabel="Forecast Directory"
                actionHref="/forecast/directory"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="error" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ErrorState - Cannot Verify Product Availability</CardTitle>
              <CardDescription>
                Used when product catalog is temporarily unavailable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorState
                message="Product catalog is temporarily unavailable. Cannot determine whether data exists or is unpublished. Retry or contact operations if this persists."
                onRetry={() => alert("Retry clicked")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawn" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>WithdrawnState - Source Product Retracted</CardTitle>
              <CardDescription>
                Used when batch was retracted with reason and alternatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WithdrawnState
                message="Batch v2.3.1 was retracted on 2024-03-15 14:30 UTC."
                reason="Quality check failed - member 7 grid anomaly"
                timestamp="2024-03-15 14:30 UTC"
                alternatives={[
                  {
                    label: "2024-03-15 00Z v2.3.2 (re-run, published 16:00 UTC)",
                    href: "/cycles/2024-03-15-00Z/v2.3.2",
                  },
                  {
                    label: "2024-03-14 18Z v2.3.1 (+6h offset)",
                    href: "/cycles/2024-03-14-18Z/v2.3.1",
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restricted" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>RestrictedState - TP Restricted</CardTitle>
              <CardDescription>
                Used when precipitation is restricted until verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RestrictedState
                message="Precipitation (TP) is restricted until accumulation window and f000 semantics are verified."
                alternatives={[
                  { label: "10m Wind", value: "10m_wind" },
                  { label: "2m Temperature", value: "2m_temp" },
                  { label: "Surface Pressure", value: "mslp" },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="not-available" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>NotAvailableState - Not Yet Available</CardTitle>
              <CardDescription>
                Used when cycle has not been published
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotAvailableState
                message="Cycle 2024-03-15 06Z has not been published. See Cycle Detail for production status."
                cycleId="2024-03-15 06Z"
                actionLabel="View Cycle Detail"
                actionHref="/cycles/2024-03-15-06Z"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Design Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Icons Used (Heroicons)</h3>
            <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
              <li>EmptyState: MagnifyingGlassIcon</li>
              <li>ErrorState: ExclamationTriangleIcon</li>
              <li>WithdrawnState: XCircleIcon</li>
              <li>RestrictedState: NoSymbolIcon</li>
              <li>NotAvailableState: ClockIcon</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Semantic Colors</h3>
            <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
              <li>ErrorState: warning-500 (orange)</li>
              <li>WithdrawnState: error-500 (red)</li>
              <li>RestrictedState: error-500 (red)</li>
              <li>NotAvailableState: info-500 (blue)</li>
              <li>EmptyState: neutral (gray)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Accessibility</h3>
            <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
              <li>All components use proper ARIA labels (role, aria-live, aria-hidden)</li>
              <li>Icons marked as aria-hidden="true"</li>
              <li>Error/Withdrawn states use aria-live="assertive"</li>
              <li>Empty/NotAvailable/Restricted use aria-live="polite"</li>
              <li>No emoji anywhere (Heroicons only)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
