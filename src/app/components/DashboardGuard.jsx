import { useEffect } from 'react'
import { useNavigate } from '@/lib/router-compat'
import { useAuth } from '../context/AuthContext'
import { DashboardProvider } from '../context/DashboardContext'
import DashboardLayout from './DashboardLayout'

function BootScreen({ label = 'Restoring your session' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#FBFAF7]">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[#0E7C8B] animate-bounce"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
      <p className="text-xs uppercase tracking-[0.25em] text-[#8C8579]">{label}</p>
    </div>

  )
}

/**
 * Waits for Firebase to restore the cached session before deciding anything.
 * This is what stops the dashboard from bouncing to the landing page on reload.
 */
export default function DashboardGuard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true })
  }, [loading, user])

  if (loading) return <BootScreen />
  if (!user) return <BootScreen label="Redirecting to sign in" />

  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  )
}
