import { GeneratorPage } from "@/app/components/generator/generator-page"
import { pageMetadata } from "./page-metadata"

export const generateMetadata = pageMetadata("passphrase")

export default function PassphrasePage() {
  return <GeneratorPage page="passphrase" />
}
