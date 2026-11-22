import { PrivacyPolicy } from "@/app/components/privacy/privacy-policy"
import { pageMetadata } from "../page-metadata"

export const generateMetadata = pageMetadata("privacy")

export default function PrivacyPage() {
  return <PrivacyPolicy />
}
