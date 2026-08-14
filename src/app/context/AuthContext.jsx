import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  // `loading` stays true until Firebase has restored any cached session, so
  // guarded screens never flash the landing page for a signed-in user.
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!auth) return undefined
    const unsub = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  // Live profile document (username, avatar, role, bio...)
  useEffect(() => {
    if (!user || !db) {
      setProfile(null)
      return undefined
    }
    const ref = doc(db, 'users', user.uid)
    const unsub = onSnapshot(
      ref,
      (snap) => setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null),
      (err) => console.error('profile subscribe error', err)
    )
    return unsub
  }, [user])

  const refreshProfile = useCallback(async () => {
    if (!user || !db) return null
    const snap = await getDoc(doc(db, 'users', user.uid))
    const data = snap.exists() ? { id: snap.id, ...snap.data() } : null
    setProfile(data)
    return data
  }, [user])

  const loginWithGoogle = async () => {
    try {
      setLoading(true)
      googleProvider.setCustomParameters({ prompt: 'select_account' })
      const result = await signInWithPopup(auth, googleProvider)
      setLoading(false)
      return result
    } catch (err) {
      console.error('Login error:', err)
      setError(err)
      setLoading(false)
      throw err
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setProfile(null)
    } catch (err) {
      console.error('Logout error:', err)
      setError(err)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, refreshProfile, loading, error, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
