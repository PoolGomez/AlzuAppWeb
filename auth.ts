import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"

import authConfig from "@/auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
    callbacks: {
        //jwt() se ejecuta cada vez que se crea o actualiza un token JWT
        // aqui es donde puedes agregar informacion adicional al token
        jwt({ token, user }) {
          if (user) { // User is available during sign-in
            token.role = user.role
          }
          return token
        },
        // session() se utiliza para agregar la informacion del token a la sesion del usuario
        // lo que hace este disponible en el cliente
        session({ session, token 
          // ,user 
        }) {
          session.user.role = token.role
          // session.user.id = user.id
          // session.user.id = "cm7task8x0002wt849i04m2h3"
          return session
        },
      },
})