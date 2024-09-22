import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import './WatchAd.css';

function WatchAd({ userId, adsWatched, rewards, onAdWatched }) {

    const [message, setMessage] = useState('');

    const handleWatchAd = async () => {

        const newAdsWatched = adsWatched + 1;
        const newRewards = rewards + 0.10;

        console.log('Updating user with ID: ', userId);

        const { data, error } = await supabase
            .from('users')
            .update({ ads_watched: newAdsWatched, rewards: newRewards })
            .eq('id', userId);
            // .select();

        if (error) {
            setMessage('Error updating user data.');
            console.error('Error updating data in Supabase: ', error.message);
        } else {
            setMessage('Ad watched successfully.');
            console.log('Supabase updated with new data:', data);

            onAdWatched(newAdsWatched, newRewards);
        }
    };

    return (
        <div className='watch-ad'>
            <button onClick={handleWatchAd}>Watch an Ad</button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default WatchAd;
