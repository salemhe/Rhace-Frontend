import * as React from "react"
import { cn } from "@/lib/utils"

const Card = (
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("bg-white rounded-xl shadow p-4", className)} {...props} />
  )
)
Card.displayName = "Card"

const CardHeader = (
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-2", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle =(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = (
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = (
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = (
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4 flex items-center", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
