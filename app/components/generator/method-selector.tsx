"use client"

import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useI18n } from "@/lib/i18n"
import type { ReactNode } from "react"

interface MethodSelectorProps {
  activeTab: string
  onTabChange: (value: string) => void
  children?: ReactNode
}

/**
 * Method selector component for switching between Password, Passphrase, and Learn tabs
 * Wraps children with Tabs context
 */
export function MethodSelector({ activeTab, onTabChange, children }: MethodSelectorProps) {
  const { t } = useI18n()

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-3 h-auto">
        <TabsTrigger value="password" className="text-sm sm:text-base whitespace-normal py-2">
          {t.tabs.password}
        </TabsTrigger>
        <TabsTrigger value="passphrase" className="text-sm sm:text-base whitespace-normal py-2">
          {t.tabs.passphrase}
        </TabsTrigger>
        <TabsTrigger value="learn" className="text-sm sm:text-base whitespace-normal py-2">
          {t.tabs.learn}
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}

