import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Design System Baseline</h1>
        <p className="text-muted-foreground">
          Core design tokens, components, and patterns for the meteorological downscaling platform.
        </p>
      </div>

      <Separator />

      {/* Colors Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Design tokens from DESIGN.md - Neutral foundation (70%) + Semantic status (20%)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Neutral Colors</CardTitle>
              <CardDescription>Canvas, surfaces, text hierarchy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded border" style={{ backgroundColor: '#FAFAFA' }} />
                <div>
                  <div className="font-mono text-sm">neutral-100</div>
                  <div className="text-xs text-muted-foreground">#FAFAFA - Background</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded border" style={{ backgroundColor: '#F5F5F5' }} />
                <div>
                  <div className="font-mono text-sm">neutral-200</div>
                  <div className="text-xs text-muted-foreground">#F5F5F5 - Surface</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded border" style={{ backgroundColor: '#E0E0E0' }} />
                <div>
                  <div className="font-mono text-sm">neutral-300</div>
                  <div className="text-xs text-muted-foreground">#E0E0E0 - Border</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded border" style={{ backgroundColor: '#707070' }} />
                <div>
                  <div className="font-mono text-sm">neutral-500</div>
                  <div className="text-xs text-muted-foreground">#707070 - Secondary Text</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded border" style={{ backgroundColor: '#1A1A1A' }} />
                <div>
                  <div className="font-mono text-sm">neutral-900</div>
                  <div className="text-xs text-muted-foreground">#1A1A1A - Primary Text</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Semantic Colors</CardTitle>
              <CardDescription>Status indicators with Heroicons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded flex items-center justify-center" style={{ backgroundColor: '#D1F4E0' }}>
                  <CheckCircleIcon className="w-6 h-6" style={{ color: '#0F7F3F' }} />
                </div>
                <div>
                  <div className="font-mono text-sm">success-500</div>
                  <div className="text-xs text-muted-foreground">#0F7F3F - Published batches</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                  <ExclamationTriangleIcon className="w-6 h-6" style={{ color: '#D97706' }} />
                </div>
                <div>
                  <div className="font-mono text-sm">warning-500</div>
                  <div className="text-xs text-muted-foreground">#D97706 - Partial availability</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                  <XCircleIcon className="w-6 h-6" style={{ color: '#DC2626' }} />
                </div>
                <div>
                  <div className="font-mono text-sm">error-500</div>
                  <div className="text-xs text-muted-foreground">#DC2626 - Withdrawn batches</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded flex items-center justify-center" style={{ backgroundColor: '#F0F9FF' }}>
                  <InformationCircleIcon className="w-6 h-6" style={{ color: '#0369A1' }} />
                </div>
                <div>
                  <div className="font-mono text-sm">info-500</div>
                  <div className="text-xs text-muted-foreground">#0369A1 - Informational notices</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Typography Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Typography</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Inter for UI, JetBrains Mono for data (currently using Geist as fallback)
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Type Scale</CardTitle>
            <CardDescription>4px base spacing for dense layouts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">text-xs (12px)</div>
              <div className="text-xs">Table cell metadata, map scale labels</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">text-sm (14px)</div>
              <div className="text-sm">Table body text, secondary labels</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">text-base (16px)</div>
              <div className="text-base">Body text, form inputs</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">text-lg (18px)</div>
              <div className="text-lg">Section headers, panel titles</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">text-xl (20px)</div>
              <div className="text-xl">Page titles</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">text-2xl (24px)</div>
              <div className="text-2xl">Top-level navigation</div>
            </div>
            <Separator />
            <div>
              <div className="text-xs text-muted-foreground mb-1">font-mono (Tabular numerics)</div>
              <div className="font-mono">12.3 m/s | +0.5 m/s | 2024-03-15 00Z</div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Components Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Base Components</h2>
          <p className="text-sm text-muted-foreground mb-6">
            shadcn/ui with Nova preset + Heroicons integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Buttons & Badges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-success-100 text-success-700 border-success-300">
                  <CheckCircleIcon className="w-3 h-3 mr-1 inline" />
                  Published
                </Badge>
                <Badge className="bg-warning-100 text-warning-700 border-warning-300">
                  <ExclamationTriangleIcon className="w-3 h-3 mr-1 inline" />
                  Partial
                </Badge>
                <Badge className="bg-error-100 text-error-700 border-error-300">
                  <XCircleIcon className="w-3 h-3 mr-1 inline" />
                  Withdrawn
                </Badge>
                <Badge className="bg-neutral-200 text-neutral-600">
                  Unpublished
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Cycle ID (e.g., 2024-03-15-00Z)" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select variable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10m_wind">10m Wind Speed</SelectItem>
                  <SelectItem value="2m_temp">2m Temperature</SelectItem>
                  <SelectItem value="mslp">Surface Pressure</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Table Example</CardTitle>
            <CardDescription>Compact 36px row height for dense cycle lists</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cycle ID</TableHead>
                  <TableHead>Init Time</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">2024-03-15-00Z</TableCell>
                  <TableCell className="text-sm">2024-03-15 00Z</TableCell>
                  <TableCell className="font-mono text-sm">90/90</TableCell>
                  <TableCell>
                    <Badge className="bg-success-100 text-success-700 border-success-300">
                      <CheckCircleIcon className="w-3 h-3 mr-1 inline" />
                      Published
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">2024-03-14-18Z</TableCell>
                  <TableCell className="text-sm">2024-03-14 18Z</TableCell>
                  <TableCell className="font-mono text-sm">87/90</TableCell>
                  <TableCell>
                    <Badge className="bg-warning-100 text-warning-700 border-warning-300">
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1 inline" />
                      Partial
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">2024-03-14-12Z</TableCell>
                  <TableCell className="text-sm">2024-03-14 12Z</TableCell>
                  <TableCell className="font-mono text-sm">90/90</TableCell>
                  <TableCell>
                    <Badge className="bg-error-100 text-error-700 border-error-300">
                      <XCircleIcon className="w-3 h-3 mr-1 inline" />
                      Withdrawn
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Spacing Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Spacing System</h2>
          <p className="text-sm text-muted-foreground mb-6">
            4px base for dense professional layouts
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Spacing Scale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-primary" />
              <div className="text-sm">space-1 (4px) - tight icon-text gaps</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-primary" />
              <div className="text-sm">space-2 (8px) - form field gaps, table cell padding</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-8 bg-primary" />
              <div className="text-sm">space-3 (12px) - component internal spacing</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-4 h-8 bg-primary" />
              <div className="text-sm">space-4 (16px) - between related components</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-8 bg-primary" />
              <div className="text-sm">space-6 (24px) - between unrelated sections</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary" />
              <div className="text-sm">space-8 (32px) - page-level margins</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-primary" />
              <div className="text-sm">space-12 (48px) - major section separators</div>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="text-center text-sm text-muted-foreground py-8">
        <p>Design System Baseline - YU-322</p>
        <p>Tailwind 4 + shadcn/ui (Nova preset) + Heroicons</p>
      </div>
    </div>
  );
}
