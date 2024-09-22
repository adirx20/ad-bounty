import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

function UserData({ onUserDataLoaded }) {

    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                setMessage('Error: No session found.');
                return;
            }

            const userId = session.user.id;
            const userEmail = session.user.email;

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id, ads_watched, rewards')
                .eq('id', userId)
                .maybeSingle();

            if (userError) {
                console.error('Error fetching user data: ', userError?.message);
                setMessage('Error fetching user data.');
                return;
            }

            if (!userData) {
                console.log('No user found, inserting new user.');
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: userId,
                        email: userEmail,
                        ads_watched: 0,
                        rewards: 0
                    });

                if (insertError) {
                    console.error('Error inserting new user:', insertError.message);
                    setMessage('Error inserting new user.');
                    return;
                } else {
                    console.log('New user inserted. Passing values (0,0).');
                    setMessage('User created successfully.');
                    onUserDataLoaded(userId, 0, 0);
                }
            } else {
                console.log('User data fetched: ', userData);
                onUserDataLoaded(userId, userData.ads_watched, userData.rewards);
            }
        };

        fetchUserData();
    }, [onUserDataLoaded]);
    
    return (
        <div>
            <p>{message}</p>
        </div>
    );
}

export default UserData;
