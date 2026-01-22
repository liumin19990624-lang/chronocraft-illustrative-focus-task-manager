import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
// Standardized types for Tooltip and Legend content to avoid injection errors
const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  }
>(
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
      formatter,
      color,
      nameKey,
      labelKey,
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
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!hideLabel && (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter ? labelFormatter(label, payload) : label}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemColor = color || item.payload?.fill || item.color
            return (
              <div
                key={item.dataKey || index}
                className="flex items-center gap-1.5"
              >
                {!hideIndicator && (
                  <div
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      indicator === "dot" && "h-1.5 w-1.5",
                      indicator === "line" && "h-0.5 w-3",
                      indicator === "dashed" && "h-0.5 w-3 border-b border-dashed"
                    )}
                    style={{ backgroundColor: itemColor }}
                  />
                )}
                <div className="flex flex-1 items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                  {item.value && (
                    <span className="font-mono font-medium text-foreground">
                      {item.value.toLocaleString()}
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
const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const safePayload = (payload as any[]) ?? []
  if (!safePayload.length) {
    return null
  }
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {safePayload.map((item, index) => {
        return (
          <div
            key={item.value || index}
            className="flex items-center gap-1.5 text-xs font-medium"
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
})
ChartLegendContent.displayName = "ChartLegend"
export { ChartTooltipContent, ChartLegendContent }