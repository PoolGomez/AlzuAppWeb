"use client"
import { z} from "zod"
import { loginSchema } from "@/lib/zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Github, Twitch } from "lucide-react"
import ButtonSocial from "../../components/button-social"
import { loginAction } from "../actions/login-action"

interface FormLoginProps {
  isVerified: boolean;
  OAuthAccountNotLinked: boolean;
}

const FormLogin = ({ isVerified, OAuthAccountNotLinked }: FormLoginProps) => {

    const [ error, setError ] = useState<string | null>(null)
    const [ isPending, startTransition ] = useTransition()
    const router = useRouter()

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues:{
            email: "",
            password: ""
        }
    })

    async function onSubmit (values: z.infer<typeof loginSchema>) {
      setError(null)
      startTransition(async() => {
        const response = await loginAction(values)
        if(response.error){
          setError(response.error)
        }else{
          router.push("/alzu/dashboard")
        }
      })
        
    }

  return (
    <div>
      <h1 className="mb-5 text-center text-2xl">Login</h1>
      {isVerified && (
        <p className="text-center text-green-500 mb-5 text-sm">
          Email verified, you can now login
        </p>
      )}
      {OAuthAccountNotLinked && (
        <p className="text-center text-red-500 mb-5 text-sm">
          To confirm your identity, sign in with the same account you used
          originally.
        </p>
      )}
    <Form {...form}>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" type="email" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />

              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {
          error && <FormMessage>{error}</FormMessage>
        }
        <Button type="submit" disabled={isPending}>Submit</Button>
      </form>
    </Form>

    <div className="mt-5 space-y-4">
    <ButtonSocial provider="github">
      {/* <FaGithub className="mr-2 h-4 w-4" /> */}
      <Github className="mr-2 h-4 w-4" />
      <span>Sign in with Github</span>
    </ButtonSocial>
    <ButtonSocial provider="google">
      {/* <FaGoogle className="mr-2 h-4 w-4" /> */}
      <Twitch className="mr-2 h-4 w-4" />
      <span>Sign in with Google</span>
    </ButtonSocial>
    </div>
</div>
  )
}

export default FormLogin
