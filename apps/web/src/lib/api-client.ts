import { env } from '@saas/env'
import { getCookie } from 'cookies-next'
import type { CookieValueTypes } from 'cookies-next/lib/types'
import ky from 'ky'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export const API = ky.create({
	prefixUrl: env.NEXT_PUBLIC_API_URL,
	hooks: {
		beforeRequest: [
			async (request) => {
				let token: RequestCookie | CookieValueTypes

				if (typeof window === 'undefined') {
					const { cookies } = await import('next/headers')
					const cookiesFromServer = await cookies()
					token = cookiesFromServer.get('@SAAS:token')?.value
				}

				if (typeof window !== 'undefined') {
					token = getCookie('@SAAS:token')
				}

				if (token) {
					request.headers.set('Authorization', `Bearer ${token}`)
				}
			},
		],
	},
})
