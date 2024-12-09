import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import prisma from '@/lib/prisma'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { JWT } from "next-auth/jwt"

interface ExtendedToken extends JWT {
  id: string;
  role: string;
  hasAccess: boolean;
}

export const authOptions: AuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (data: any) => {
      // 检查用户是否已存在
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { name: data.name }
          ]
        }
      });

      if (existingUser) {
        return existingUser;
      }

      const user = await prisma.user.create({ data });
      
      // 检查用户是否已有推广码
      const existingReferralCode = await prisma.referralCode.findFirst({
        where: { userId: user.id }
      });

      if (!existingReferralCode) {
        // 自动创建推广码
        await prisma.referralCode.create({
          data: {
            userId: user.id,
            code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            discountPercent: 10,
            commissionRate: 20,
            isActive: true,
          },
        });
      }
      
      return user;
    },
    linkAccount: async (data: any) => {
      const { refresh_token_expires_in, ...accountData } = data;
      
      // 检查账号是否已存在
      const existingAccount = await prisma.account.findFirst({
        where: {
          provider: accountData.provider,
          providerAccountId: accountData.providerAccountId,
        }
      });

      if (existingAccount) {
        // 更新现有账号
        return prisma.account.update({
          where: { id: existingAccount.id },
          data: accountData,
        }) as any;
      }

      return prisma.account.create({
        data: accountData,
      }) as any;
    }
  } as any,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: 'read:user user:email'
        }
      },
      profile(profile: any) {
        console.log('GitHub profile data:', JSON.stringify(profile, null, 2));
        
        // Get email from profile data
        let email = profile.email;
        
        // If no email in profile, try to get from verified emails
        if (!email && profile.emails && Array.isArray(profile.emails)) {
          const verifiedEmail = profile.emails.find((e: any) => e.verified && e.primary);
          if (verifiedEmail) {
            email = verifiedEmail.email;
          } else {
            // Fallback to first verified email
            const firstVerified = profile.emails.find((e: any) => e.verified);
            if (firstVerified) {
              email = firstVerified.email;
            }
          }
        }

        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: email,
          image: profile.avatar_url,
          role: 'user',
          hasAccess: false,
        }
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
            role: 'user',
          }
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.hashedPassword) {
          throw new Error('Please login with OAuth provider');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasAccess: user.hasAccess || false,
          image: user.image,
        } as any;
      }
    }),
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
            role: 'admin',
          }
        });

        if (!user) {
          throw new Error('Invalid admin credentials');
        }

        if (!user.hashedPassword) {
          throw new Error('Please login with OAuth provider');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid admin credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasAccess: true,
          image: user.image,
        } as any;
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        const { refresh_token_expires_in, ...accountData } = account as any;
        account = accountData;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          hasAccess: user.hasAccess || false,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          hasAccess: token.hasAccess,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      // If the url is relative, prefix it with the base url
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // If the url is already absolute but on the same host, return it
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default to the dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 