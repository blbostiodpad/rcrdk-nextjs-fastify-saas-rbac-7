import { compare, hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { errors } from '@/errors/messages'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function updatePassword(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.patch(
			'/users/passwords',
			{
				schema: {
					tags: ['Account'],
					summary: 'Update or create account password.',
					security: [{ bearerAuth: [] }],
					body: z.object({
						currentPassword: z.string().nullish(),
						newPassword: z.string().min(6),
					}),
				},
			},
			async (request, reply) => {
				const userId = await request.getCurrentUserId()
				const { currentPassword, newPassword } = request.body

				const user = await prisma.user.findUnique({
					where: {
						id: userId,
					},
				})

				if (!user) {
					throw new BadRequestError(errors.auth.INVALID_CREDENTIALS)
				}

				if (user.passwordHash) {
					if (!currentPassword) {
						throw new BadRequestError(errors.auth.INVALID_CREDENTIALS)
					}

					const isPasswordValid = await compare(
						currentPassword,
						user.passwordHash,
					)

					if (!isPasswordValid) {
						throw new BadRequestError(errors.auth.INVALID_CREDENTIALS)
					}
				}

				const hashedPassword = await hash(newPassword, 8)

				await prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						passwordHash: hashedPassword,
					},
				})

				reply.status(204).send()
			},
		)
}
