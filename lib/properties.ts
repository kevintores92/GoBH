import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const propertiesDirectory = path.join(process.cwd(), 'content/properties')

export interface Property {
  slug: string
  title: string
  location?: string
  featuredImage?: string
  gallery?: string[]
  description?: string
  address?: string
  propertyType?: string
  status?: string
  yearAcquired?: string
  units?: number
  squareFootage?: number
  date?: string
  contentHtml?: string
  excerpt?: string
}

export async function getAllProperties(): Promise<Property[]> {
  // Create directory if it doesn't exist
  if (!fs.existsSync(propertiesDirectory)) {
    fs.mkdirSync(propertiesDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(propertiesDirectory)
  const allPropertiesData = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        const property = await getPropertyBySlug(slug)
        return property
      })
  )

  return allPropertiesData
    .filter((property): property is Property => property !== null)
    .sort((a, b) => {
      if (a.date && b.date) {
        return a.date < b.date ? 1 : -1
      }
      return 0
    })
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const fullPath = path.join(propertiesDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Convert markdown to HTML
    const processedContent = await remark().use(html).process(content)
    const contentHtml = processedContent.toString()

    // Create excerpt from content
    const excerpt = content.slice(0, 150).replace(/[#*`]/g, '') + '...'

    return {
      slug,
      contentHtml,
      excerpt,
      ...data,
    } as Property
  } catch (error) {
    return null
  }
}
