import { Metadata } from 'next'

import { ability, getCurrentOrganization } from '@/auth'
import { getOrganization } from '@/http/get-organization'

import { Invites } from './invites'
import { MemberList } from './member-list'

export async function generateMetadata(): Promise<Metadata> {
	const slug = getCurrentOrganization()

	const { organization } = await getOrganization(slug!)

	return {
		title: `${organization.name} Members`,
	}
}

export default async function MembersPage() {
	const permissions = await ability()

	return (
		<div className="w-full space-y-6 self-start sm:space-y-8">
			<h1 className="text-2xl font-bold">Members</h1>

			<div className="space-y-6 sm:space-y-8">
				{permissions?.can('get', 'Invite') && <Invites />}
				{permissions?.can('get', 'User') && <MemberList />}
			</div>
		</div>
	)
}
