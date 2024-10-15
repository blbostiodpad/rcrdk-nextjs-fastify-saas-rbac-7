import { IconCircleX } from '@tabler/icons-react'
import { redirect } from 'next/navigation'

import { getCurrentOrganization } from '@/auth'
import { Button } from '@/components/ui/button'
import { shutdownOrganization } from '@/http/shutdown-organization'

export function ShutdownOrganizationButton() {
	async function shutdownOrganizationAction() {
		'use server'

		const currentOrganization = getCurrentOrganization()

		await shutdownOrganization({ organization: currentOrganization! })

		redirect('/')
	}

	return (
		<form action={shutdownOrganizationAction}>
			<Button type="submit" variant="destructive" className="w-56">
				<IconCircleX className="mr-2" stroke={1.5} />
				Shutdown organization
			</Button>
		</form>
	)
}