import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  username: string
  email: string
  role: string
  iat: number
  exp: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

// Verify admin token
async function verifyAdminToken(req: NextRequest): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    
    if (decoded.role !== 'admin') {
      return null
    }

    return decoded
  } catch {
    return null
  }
}

// GET - Get Discord webhook status
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminToken(req)
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1409164037916459029/j7HHOjx1voDq6T0aih-A8_8O_cIKw2CEoQFM3aR8I1jVQfUJJVOwE6ehInGY3cLs4i6P'
    const isEnabled = process.env.ENABLE_DISCORD_LOGGING !== 'false'

    if (!isEnabled) {
      return NextResponse.json({
        isEnabled: false,
        status: 'disconnected',
        message: 'Discord logging is disabled'
      })
    }

    // Test webhook connectivity
    try {
      const testPayload = {
        embeds: [{
          title: '🔗 Webhook Test',
          description: 'Testing Discord webhook connectivity',
          color: 0x00ff00,
          timestamp: new Date().toISOString(),
          footer: {
            text: 'College Chatbot Admin Logs'
          }
        }]
      }

      const response = await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      })

      if (response.ok) {
        return NextResponse.json({
          isEnabled: true,
          status: 'connected',
          lastSent: new Date().toISOString(),
          message: 'Webhook is working correctly'
        })
      } else {
        return NextResponse.json({
          isEnabled: true,
          status: 'error',
          message: `Webhook test failed with status: ${response.status}`
        })
      }
    } catch (error) {
      return NextResponse.json({
        isEnabled: true,
        status: 'error',
        message: `Webhook test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    }
  } catch (error) {
    console.error('Discord status API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Test webhook with custom message
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminToken(req)
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { message = 'Test message from admin dashboard' } = await req.json()

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1409066599624998942/h1Bph4iEIWvyqjjoCpdHL8u89nV4ltY3pmvR0j7imXX-E7uxeBcsmEgTOeUVMpSyytYi'

    const testPayload = {
      embeds: [{
        title: '🧪 Admin Test Message',
        description: message,
        color: 0x0099ff,
        fields: [
          {
            name: '👤 Admin',
            value: admin.username,
            inline: true
          },
          {
            name: '🆔 Admin ID',
            value: admin.userId,
            inline: true
          },
          {
            name: '⏰ Timestamp',
            value: new Date().toLocaleString(),
            inline: true
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'College Chatbot Admin Logs'
        }
      }]
    }

    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    })

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Test message sent successfully to Discord',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        message: `Failed to send test message: ${response.status} ${response.statusText}`,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Discord test API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
