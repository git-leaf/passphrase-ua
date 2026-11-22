import { GeneratorPage } from "@/app/components/generator/generator-page"
import { pageMetadata } from "../page-metadata"

export const generateMetadata = pageMetadata("learn")

export default function LearnPage() {
  return <GeneratorPage page="learn" />
}
