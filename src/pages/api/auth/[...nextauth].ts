import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { query as q} from 'faunadb';
import { fauna } from '../../../services/fauna';
import { signIn } from "next-auth/client";

export default NextAuth({
  
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      /* a propriedade scope define o que será buscado na rede social escolhida
        no caso do github, pode apenas pegar informações básicas como nome do usuários, ou até mesmo informações mais avançadas, como repositórios públicos e privados
      */
      scope: 'read:user'
      /*caso tivesse mais escopos, bastaria separá-los com vírgula. 
      Ex: 'read:user, escopo2,escopo3,etc'
      */
    }),
  ],
  callbacks: {
    
    async session(session){
      try{
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active'
              )
            ])
          )
        )

        return {
            ...session,
            activeSubscription: userActiveSubscription
        };
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn(user, account, profile) {
        const {email} = user;

        try{
            await fauna.query(
                //se NÃO existir usuário com o mesmo e-mail
                q.If(
                  q.Not(
                    q.Exists(
                      q.Match(
                        //primeiro seleciona qual o index para utilizar como parâmetro
                        q.Index('user_by_email'),
                        //depois passa o valor para buscar
                        //Casefold normaliza a string, transformando tudo para lowerCase
                        q.Casefold(user.email)
                      )
                    )
                  ),
                  
                  //IF TRUE, cria
                  q.Create(
                    q.Collection('users'),
                    {data: {email} }
                  ),

                  //ELSE(já existe usuário com o e-mail), busca do BD o registro
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(user.email)
                    )
                  )
                )
            );

            //retorno TRUE quer dizer que tudo deu certo e vice-versa caso for FALSE
            return true;
        } catch{
            return false;
        }
        
        
    },
  }
})