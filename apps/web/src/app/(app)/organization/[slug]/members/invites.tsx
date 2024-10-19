import { IconDotsVertical } from '@tabler/icons-react'

import { ability, getCurrentOrganization } from '@/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getInvites } from '@/http/get-invites'
import { getRoleName } from '@/utils/get-role-name'

import { CreateInviteForm } from './create-invite-form'
import { RevokeInviteButton } from './revoke-invite-button'

export async function Invites() {
	const currentOrganizarion = getCurrentOrganization()
	const permissions = await ability()

	const { invites } = await getInvites({
		organizationSlug: currentOrganizarion!,
	})

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold">Pending invites:</h2>

			<div className="rounded border">
				{permissions?.can('create', 'Invite') && (
					<>
						<Card className="border-0">
							<CardHeader className="sr-only">
								<CardTitle className="text-md">Invite a new member</CardTitle>
							</CardHeader>
							<CardContent className="p-4">
								<CreateInviteForm />
							</CardContent>
						</Card>

						<div className="border-t" />
					</>
				)}

				<Table>
					<TableBody>
						{invites.map((invite) => (
							<TableRow key={invite.id}>
								<TableCell className="py-2.5" style={{ width: '100%' }}>
									<div className="flex flex-col">
										<span className="font-medium">{invite.email}</span>
										<span className="text-xs text-muted-foreground">
											{getRoleName(invite.role)}
										</span>
									</div>
								</TableCell>

								{permissions?.can('delete', 'Invite') && (
									<TableCell className="py-2.5">
										<div className="flex justify-end">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="outline"
														size="icon"
														className="size-8"
													>
														<IconDotsVertical size={20} />
													</Button>
												</DropdownMenuTrigger>

												<DropdownMenuContent align="end">
													<RevokeInviteButton inviteId={invite.id} />
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>

				{invites.length === 0 && (
					<div className="p-4 text-sm text-muted-foreground">
						There are not pending invites for this organization.
					</div>
				)}
			</div>
		</div>
	)
}
