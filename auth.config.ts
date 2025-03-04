// import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/zod";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";
import {nanoid} from "nanoid"
import { sendEmailVerification } from "./lib/mail";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
        // // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // // e.g. domain, username, password, 2FA token, etc.
        // credentials: {
        //   email: {},
        //   password: {},
        // },
        // authorize: async (credentials) => {
        //   let user = null
   
        //   // logic to salt and hash password
        //   const pwHash = saltAndHashPassword(credentials.password)
   
        //   // logic to verify if the user exists
        //   user = await getUserFromDb(credentials.email, pwHash)
   
        //   if (!user) {
        //     // No user found, so this is their first attempt to login
        //     // Optionally, this is also the place you could do a user registration
        //     throw new Error("Invalid credentials.")
        //   }
   
        //   // return user object with their profile data
        //   return user
        // },

        authorize: async(credentials) => {

            console.log({credentials});
            // if(credentials.email !=="test@test.com"){
            //     throw new Error("Invalid credentials.")
            // }
            // return {
            //     id:"1",
            //     name:"Text User",
            //     email:"test@test.com"
            // }

            const {data, success} =loginSchema.safeParse(credentials);
            if(!success){
              throw new Error("Invalid credentials.");
            }
            //verificar si el usuario existe
            const user = await db.user.findUnique({
              where:{
                email: data.email,
                // password: data.password
              }
            })
            if(!user || !user.password){
              throw new Error("No user found");
            }

            //verificar si la contraseña es correcta
            const isValid = await bcrypt.compare(data.password, user.password);
            
            if(!isValid){
              throw new Error("Incorrect password");
            }

            // verificacaion d e email
            if(!user.emailVerified){
              const verifyTokenExits = await db.verificationToken.findFirst({
                where:{
                  identifier: user.email
                }
              })

              //si existe un token , lo eliminamos
              if(verifyTokenExits?.identifier){
                await db.verificationToken.delete({
                  where:{
                    identifier: user.email
                  }
                })
              }
              const token = nanoid()

              await db.verificationToken.create({
                data:{
                  identifier:user.email,
                  token,
                  expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
                }
              })

              //enviar email de verificacion
              await sendEmailVerification(user.email, token);


              throw new Error("Please check Email send verification");
            }

            return user;

        }
      }),
  ],
} satisfies NextAuthConfig