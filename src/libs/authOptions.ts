import Credentials from "next-auth/providers/credentials";

import prisma from "@/libs/prisma";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
    
     
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const userFound = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!userFound) {
          throw new Error("usuario y contraseña incorrectos");
        }

        const matchPassword = await bcrypt.compare(
          password,
          userFound.password
        );

        if (!matchPassword) {
          throw new Error("usuario y contraseña no validos");
        }

        return {
          id: userFound.id + "",
          // name: userFound.name,
          // email: userFound?.email,
          // image: "",
          // lastname: userFound.last_name,
          // role: userFound.role,
          // confirmed_email: userFound.confirmed_email,
          ...userFound, // subbscriptionId: "null"
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token = { ...token, ...user };
      }

      console.log({ user, trigger, session });

      // triggger es una funcion que permite actualizar la session en front
      // por loq ue en este caso el subscriptionId viene en null al principio, pero al
      // pagar una subscription cambiara al dato que corresponde
      if (trigger === "update" && session.user) {
        token.user = {
          ...(token.user as any),
          ...session.user,
          user: {
            subscriptionId: session.user.subscriptionId,
          },
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          ...token,
        } as any;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
