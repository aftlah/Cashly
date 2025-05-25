'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
    const router = useRouter()

    useEffect(() => {
        const supabase = createClient()

        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                console.log('OAuth login success:', data.session)
                router.replace('/')
            } else {
                console.log('OAuth login failed')
                router.replace('/auth/login')
            }
        })
    }, [router])

    return <p>Logging in...</p>
}
