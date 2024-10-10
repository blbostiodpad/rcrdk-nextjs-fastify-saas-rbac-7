import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { env } from '@saas/env'
import { fastify } from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authenticateWithGitHub } from './routes/auth/authenticate-with-github'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecover } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { creteOrganization } from './routes/organization/create-organization'
import { getMemebership } from './routes/organization/get-membership'
import { getOrganization } from './routes/organization/get-organization'
import { getOrganizations } from './routes/organization/get-organizations'
import { shutdownOrganization } from './routes/organization/shutdown-organization'
import { transferOrganization } from './routes/organization/transfer-organization'
import { updateOrganization } from './routes/organization/update-organization'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Next.js Saas ',
			description: 'Full-stack SaaS app with multi-tenant and RBAC.',
			version: '1.0.0',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
	routePrefix: '/docs',
})

app.register(fastifyCors)

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
})

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGitHub)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)

app.register(creteOrganization)
app.register(getMemebership)
app.register(getOrganizations)
app.register(getOrganization)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)

app
	.listen({
		port: env.SERVER_PORT,
	})
	.then(() => console.log('✅ HTTP server is running.'))
