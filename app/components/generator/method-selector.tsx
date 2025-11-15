import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
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
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-3 h-auto">
        <TabsTrigger value="password" className="text-sm sm:text-base whitespace-normal py-2">
          Password
        </TabsTrigger>
        <TabsTrigger value="passphrase" className="text-sm sm:text-base whitespace-normal py-2">
          Passphrase
        </TabsTrigger>
        <TabsTrigger value="learn" className="text-sm sm:text-base whitespace-normal py-2">
          Learn
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}

