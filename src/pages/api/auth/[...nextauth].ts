import NextAuth from "next-auth"
import Providers from "next-auth/providers"

export default NextAuth({
  
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      /* a propriedade scope define o que será buscado na rede social escolhida
        no caso do github, pode apenas pegar informações básicas como nome do usuários, ou até mesmo informações mais avançadas, como repositórios públicos e privados
      */
      scope: 'read:user'
      /*caso tivesse mais escopoes, bastaria separá-los com vírgula. 
      Ex: 'read:user, escopo2,escopo3,etc'
      */
    }),
    // ...add more providers here
  ],
})