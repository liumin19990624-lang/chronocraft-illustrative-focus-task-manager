import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
export interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string | number
  className?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
  labelClassName?: string
  labelFormatter?: (label: any, payload: any[]) => React.ReactNode
  formatter?: (value: any, name: any, item: any, index: any) => React.ReactNode
  color?: string
}
const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipProps>(
  (
    {
      active,
      payload,
      className,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      label,
      labelFormatter,
      labelClassName,
      color,
      nameKey,
    },
    ref
  ) => {
    if (!active || !payload?.length) {
      return null
    }
    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-2xl border bg-background/95 backdrop-blur-md px-4 py-3 text-xs shadow-2xl",
          className
        )}
      >
        {!hideLabel && (
          <div className={cn("font-bold text-muted-foreground uppercase tracking-wider mb-1", labelClassName)}>
            {labelFormatter ? labelFormatter(label, payload) : label}
          </div>
        )}
        <div className="grid gap-2">
          {payload.map((item, index) => {
            const itemColor = color || item.payload?.fill || item.color
            return (
              <div
                key={item.dataKey || index}
                className="flex items-center gap-2"
              >
                {!hideIndicator && (
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      indicator === "dot" && "h-2 w-2",
                      indicator === "line" && "h-0.5 w-3",
                      indicator === "dashed" && "h-0.5 w-3 border-b border-dashed"
                    )}
                    style={{ backgroundColor: itemColor }}
                  />
                )}
                <div className="flex flex-1 items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-foreground/80">
                      {item.name || item.dataKey}
                    </span>
                  </div>
                  {item.value !== undefined && (
                    <span className="font-mono font-bold text-foreground">
                      {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"
export interface ChartLegendProps {
  payload?: any[]
  verticalAlign?: "top" | "bottom" | "middle"
  className?: string
  hideIcon?: boolean
  nameKey?: string
}
const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendProps>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom" }, ref) => {
    const safePayload = payload ?? []
    if (!safePayload.length) {
      return null
    }
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-6",
          verticalAlign === "top" ? "pb-4" : "pt-4",
          className
        )}
      >
        {safePayload.map((item, index) => {
          return (
            <div
              key={item.value || index}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              {!hideIcon && (
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {item.value}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"
export { ChartTooltipContent, ChartLegendContent }