'use client'

import {
	IconBrandGithub,
	IconExclamationCircle,
	IconMail,
	IconSettings,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'

import { signInWithGitHub } from '../actions'
import { signinWithEmailAndPassword } from './actions'

export function SignInForm() {
	const router = useRouter()

	const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
		signinWithEmailAndPassword,
		() => {
			router.push('/')
		},
	)

	return (
		<div className="space-y-4">
			<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
				{!success && message && (
					<Alert variant="destructive">
						<IconExclamationCircle size={20} />
						<AlertTitle>Sign in has failed:</AlertTitle>
						<AlertDescription>{message}</AlertDescription>
					</Alert>
				)}

				<div className="space-y-1">
					<Label htmlFor="email">E-mail</Label>
					<Input name="email" type="email" id="email" />

					{errors?.email && (
						<p className="text-xs text-red-500 dark:text-red-400">
							{errors.email.at(0)}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<Label htmlFor="password">Password</Label>
					<Input name="password" type="password" id="password" />
					{errors?.password && (
						<p className="text-xs text-red-500 dark:text-red-400">
							{errors.password.at(0)}
						</p>
					)}
				</div>

				<Link
					href="/auth/forgot-password"
					className="self-start text-xs font-medium text-foreground hover:underline"
				>
					Forgot your password?
				</Link>

				<Button type="submit" disabled={isPending} className="gap-2">
					{isPending ? (
						<>
							<IconSettings size={20} className="animate-spin duration-2000" />
							Signing in...
						</>
					) : (
						<>
							<IconMail size={20} />
							Sign-in with e-mail
						</>
					)}
				</Button>

				<Button className="gap-2" variant="link" size="sm" asChild>
					<Link href="/auth/sign-up">Create new account</Link>
				</Button>
			</form>

			<Separator />

			<form action={signInWithGitHub}>
				<Button type="submit" variant="outline" className="w-full gap-2">
					<IconBrandGithub size={20} />
					Sign-in with GitHub
				</Button>
			</form>
		</div>
	)
}