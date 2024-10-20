import { ability, getCurrentOrganization } from '@/auth'

import { NavLink } from './nav-link'

export async function Tabs() {
	const organization = getCurrentOrganization()

	const permissions = await ability()

	const canUpdateOrganization = permissions?.can('update', 'Organization')
	const canGetBilling = permissions?.can('get', 'Billing')
	const canGetMembers = permissions?.can('get', 'User')
	const canGetProjects = permissions?.can('get', 'Project')

	return (
		<div>
			<nav className="mx-auto flex w-full max-w-[1200px] gap-5 border-b">
				{canGetProjects && (
					<NavLink
						href={`/organization/${organization}`}
						includes={`/organization/${organization}/project/`}
						className="text-balance"
					>
						Projects
					</NavLink>
				)}

				{canGetMembers && (
					<NavLink href={`/organization/${organization}/members`}>
						Members
					</NavLink>
				)}

				{(canUpdateOrganization || canGetBilling) && (
					<NavLink href={`/organization/${organization}/settings`}>
						Settings and Billing
					</NavLink>
				)}
			</nav>
		</div>
	)
}