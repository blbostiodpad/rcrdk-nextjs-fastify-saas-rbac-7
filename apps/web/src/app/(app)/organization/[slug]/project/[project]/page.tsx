import { IconBriefcase, IconUser } from '@tabler/icons-react'
import { Metadata } from 'next'

import { getCurrentOrganization } from '@/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getOrganization } from '@/http/get-organization'
import { getProject } from '@/http/get-project'
import { getAvatarUrl } from '@/utils/get-avatar-url'

interface ProjectProps {
	params: {
		project: string
	}
}

export async function generateMetadata({
	params,
}: ProjectProps): Promise<Metadata> {
	const currentOrganization = getCurrentOrganization()

	const [{ organization }, { project }] = await Promise.all([
		getOrganization({
			organizationSlug: currentOrganization!,
		}),
		getProject({
			organizationSlug: currentOrganization!,
			projectSlug: params.project,
		}),
	])

	return {
		title: `${project.name} Project | ${organization.name}`,
	}
}

export default async function Project({ params }: ProjectProps) {
	const currentOrganization = getCurrentOrganization()

	const { project } = await getProject({
		organizationSlug: currentOrganization!,
		projectSlug: params.project,
	})

	return (
		<div className="w-full space-y-6 self-start sm:space-y-8">
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">{project.name}</h1>
				<p className="text-muted-foreground">{project.description}</p>

				<Avatar className="size-28">
					{project.avatarUrl && <AvatarImage src={project.avatarUrl} />}
					<AvatarFallback>
						<IconBriefcase
							size={64}
							stroke={1.25}
							className="text-muted-foreground opacity-50"
						/>
					</AvatarFallback>
				</Avatar>

				<p>{project.createdAt}</p>
				<p>{project.updatedAt}</p>

				<div className="flex items-center gap-2">
					<Avatar className="size-8">
						<AvatarImage
							src={getAvatarUrl(project.owner.avatarUrl, project.owner.email)}
						/>

						<AvatarFallback>
							<IconUser size={20} className="text-muted-foreground/50" />
						</AvatarFallback>
					</Avatar>
					<span>{project.owner.name}</span>
				</div>
			</div>
		</div>
	)
}
