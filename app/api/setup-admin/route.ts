import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'

// One-time setup: creates the admin account with temporary credentials.
// Only works while the user table is empty. Safe to leave, but can be
// removed after the account is created.
export async function GET() {
  try {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM "user"')
    const count = rows[0]?.count ?? 0

    if (count > 0) {
      return NextResponse.json({
        ok: false,
        message: 'Admin account already exists. Go to /sign-in to log in.',
      })
    }

    await auth.api.signUpEmail({
      body: {
        name: 'Infinity Marble Design',
        email: 'infinitymarbledesign@gmail.com',
        password: 'Infinity@Doha2026',
      },
    })

    return NextResponse.json({
      ok: true,
      message: 'Admin account created. Go to /sign-in and log in.',
      email: 'infinitymarbledesign@gmail.com',
    })
  } catch (error) {
    console.error('[v0] setup-admin error:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Setup failed',
      },
      { status: 500 },
    )
  }
}
