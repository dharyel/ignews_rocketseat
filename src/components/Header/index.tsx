import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ActiveLink } from '../ActiveLink';

export function Header() {
    const { asPath } = useRouter();

    /*o atributo 'prefetch' do Link faz com que a página já fique pré-carregada assim que o site for acessado.
        Ex: havendo prefetch na tag Link da página 'posts',
            esta será carregada assim que o usuário acessar a página home do site
            ou seja, o carregamento será praticamente instantaneo
    */

    
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />

                <nav>
                    <ActiveLink activeClassName={styles.active} href="/">
                        <a>Home</a>
                    </ActiveLink>
                    
                    <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
                        <a>Posts</a>
                    </ActiveLink>
                </nav>

                <SignInButton />
            </div>

        </header>
    );
}