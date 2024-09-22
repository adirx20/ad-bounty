import React, { useState, useEffect } from 'react';
import UserData from '../UserData/UserData';
import WatchAd from '../WatchAd/WatchAd';
import Withdraw from '../Withdraw/Withdraw';
import WithdrawalHistory from '../WithdrawalHistory/WithdrawalHistory';
import { supabase } from '../../utils/supabaseClient';
import './Dashboard.css';

function Dashboard({ user }) {

    const [userId, setUserId] = useState(null);
    const [adsWatched, setAdsWatched] = useState(0);
    const [rewards, setRewards] = useState(0);
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

    const handleUserDataLoaded = (userId, adsWatched, rewards) => {
        console.log("Data loaded: ", { userId, adsWatched, rewards });
        setUserId(userId);
        setAdsWatched(adsWatched);
        setRewards(rewards);
    };

    const handleAdWatched = async (newAdsWatched, newRewards) => {
        console.log('Ad watched. updating state: ', { newAdsWatched, newRewards });
        setAdsWatched(newAdsWatched);
        setRewards(newRewards);

        const { error } = await supabase
            .from('users')
            .update({ ads_watched: newAdsWatched, rewards: newRewards })
            .eq('id', userId);

        if (error) {
            console.error('Error updating data in Supabase: ', error.message);
        } else {
            console.log('Supabase updated successfully with new data.');
        }
    };

    useEffect(() => {
        // Hide welcome message after 5 seconds
        const timer = setTimeout(() => {
            setShowWelcomeMessage(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='dashboard-container'>
            {showWelcomeMessage && (
                <div className='welcome-message'>
                    <h2>Welcome, {user.email}!</h2>
                    <p>Thanks for joining AdBounty! Start earning rewards by watching ads!</p>
                </div>
            )}

            <p>Ads Watched: {adsWatched}</p>
            <p>Rewards: ${rewards.toFixed(2)}</p>

            <UserData onUserDataLoaded={handleUserDataLoaded} />

            {userId && (
                <>
                    <WatchAd
                        userId={userId}
                        adsWatched={adsWatched}
                        rewards={rewards}
                        onAdWatched={handleAdWatched}
                    />
                    <Withdraw
                        userId={userId}
                        rewards={rewards}
                        setRewards={setRewards}
                    />
                    <WithdrawalHistory userId={userId} />
                </>
            )}
        </div>
    );
}

export default Dashboard;
