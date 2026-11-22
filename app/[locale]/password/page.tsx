import { GeneratorPage } from "@/app/components/generator/generator-page"
import { pageMetadata } from "../page-metadata"

export const generateMetadata = pageMetadata("password")

export default function PasswordPage() {
  return <GeneratorPage page="password" />
}
