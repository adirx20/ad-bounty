import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import './Auth.css'

function Auth({ setUser }) {

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // Handle magic link sign-in (email based)
    const handleLogin = async () => {

        if (!email) {
            setMessage('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Check your email for the login link!');
        }

        setIsSubmitting(false);
    };

    // Handle Google OAuth login
    const handleGoogleLogin = async () => {

        setMessage('');

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Redirecting to Google login...');
        }
    };

    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <h2>Welcome to AdBounty</h2>
                <p>Earn rewards by watching ads! Sign in to continue!</p>

                <div className='input-container'>
                    <input
                        className='auth-input'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter your email'
                    />
                </div>

                <div className='button-container'>
                    <button onClick={handleLogin} disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Magic Link'}
                    </button>
                    <p>OR</p>
                    <button className='google-button' onClick={handleGoogleLogin}>
                        Sign In with Google
                    </button>
                </div>

                {message && <p className='message'>{message}</p>}
            </div>
        </div>
    );

}

export default Auth;
