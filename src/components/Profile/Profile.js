import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import './Profile.css';


function Profile({ user }) {

    const [adsWatched, setAdsWatched] = useState(0);
    const [rewards, setRewards] = useState(0);
    const [paypalEmail, setPaypalEmail] = useState('');
    const [message, setMessage] = useState('');

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            const { data: userData, error } = await supabase
                .from('users')
                .select('ads_watched, rewards, paypal_email')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching user data: ', error.message);
            } else {
                setAdsWatched(userData.ads_watched);
                setRewards(userData.rewards);
                setPaypalEmail(userData.paypal_email || '')
            }
        };

        fetchUserData();
    }, [user]);

    // Handle saving paypal email
    const handleSavePaypalEmail = async () => {

        if (!paypalEmail) {
            setMessage('Please enter a valid PayPal email address.');
            return;
        }

        const { error } = await supabase
            .from('users')
            .update({ paypal_email: paypalEmail })
            .eq('id', user.id);

        if (error) {
            setMessage(`Error updating PayPal email: ${error.message}`);
        } else {
            setMessage('PayPal email saved successfully.');
        }
    };

    return (
        <div className='profile-container'>
            <h2>Your Profile</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Ads Watched:</strong> {adsWatched}</p>
            <p><strong>Rewards:</strong> ${rewards.toFixed(2)}</p>

            <div className='paypal-section'>
                <label htmlFor='paypal-email'>PayPal Email:</label>
                <input
                    type='email'
                    id='paypal-email'
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder='Enter your PayPal email'
                />
                <button onClick={handleSavePaypalEmail}>Save PayPal Email</button>
            </div>

            {message && <p className='message'>{message}</p>}
        </div>
    );
}

export default Profile;
