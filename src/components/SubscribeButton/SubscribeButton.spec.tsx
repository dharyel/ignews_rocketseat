import { render, screen, fireEvent } from '@testing-library/react';
import { SubscribeButton } from '.';

import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';

jest.mock('next-auth/client');

jest.mock('next/router');

describe('SubscribeButton component', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(
            <SubscribeButton />
        );

        expect(screen.getByText('Subscribe now')).toBeInTheDocument();
    });

    it('redirects user to sign in when NOT authenticated', () => {
        const useSessionMocked = mocked(useSession);
        const signInMocked = mocked(signIn);
        
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SubscribeButton />)
        
        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled;
    });

    it('redirects to posts when user already has a subscription', () => {
        const useRouterMocked = mocked(useRouter);
        const useSessionMocked = mocked(useSession);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce([
            { 
                user: { 
                        name: 'Jhon Doe',  
                        email: 'john.doe@example.com' 
                },
                activeSubscription: 'fake-active-subscription', 
                expires: 'fake-expires' 
            }, 
            false
        ]);

        useRouterMocked.mockReturnValueOnce(
            {
                push: pushMock
            } as any
        );

        render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);
        
        expect(pushMock).toHaveBeenCalledWith('/posts');
    })
});
