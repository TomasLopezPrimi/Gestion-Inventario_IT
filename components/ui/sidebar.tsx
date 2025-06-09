"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Abrir menú</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Menú</h2>
            </div>
            <Separator className="my-4" />
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "hidden md:flex flex-col h-full w-[300px] border-r",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Menú</h2>
        </div>
        <Separator />
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-8 w-[200px]" />
    </div>
  )
}
