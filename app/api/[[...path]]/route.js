import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Root endpoint - GET /api/
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "GOBH Investments API" }))
    }

    // Contact form submission - POST /api/contact
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      
      // Validate required fields
      if (!body.name || !body.email || !body.phone || !body.address) {
        return handleCORS(NextResponse.json(
          { error: "All fields are required" }, 
          { status: 400 }
        ))
      }

      if (!body.agreeToTerms) {
        return handleCORS(NextResponse.json(
          { error: "You must agree to the terms and conditions" }, 
          { status: 400 }
        ))
      }

      const contactSubmission = {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        agreeToTerms: body.agreeToTerms,
        submittedAt: new Date(),
        status: 'new'
      }

      await db.collection('contact_submissions').insertOne(contactSubmission)
      
      return handleCORS(NextResponse.json({ 
        message: "Contact form submitted successfully",
        id: contactSubmission.id 
      }))
    }

    // Get all contact submissions - GET /api/contact
    if (route === '/contact' && method === 'GET') {
      const submissions = await db.collection('contact_submissions')
        .find({})
        .sort({ submittedAt: -1 })
        .limit(100)
        .toArray()

      // Remove MongoDB's _id field from response
      const cleanedSubmissions = submissions.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json(cleanedSubmissions))
    }

    // Status endpoints - POST /api/status
    if (route === '/status' && method === 'POST') {
      const body = await request.json()
      
      if (!body.client_name) {
        return handleCORS(NextResponse.json(
          { error: "client_name is required" }, 
          { status: 400 }
        ))
      }

      const statusObj = {
        id: uuidv4(),
        client_name: body.client_name,
        timestamp: new Date()
      }

      await db.collection('status_checks').insertOne(statusObj)
      return handleCORS(NextResponse.json(statusObj))
    }

    // Status endpoints - GET /api/status
    if (route === '/status' && method === 'GET') {
      const statusChecks = await db.collection('status_checks')
        .find({})
        .limit(1000)
        .toArray()

      // Remove MongoDB's _id field from response
      const cleanedStatusChecks = statusChecks.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json(cleanedStatusChecks))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error", details: error.message }, 
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute