import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import './Withdraw.css';

function Withdraw({ userId, rewards, setRewards }) {

    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleWithdraw = async () => {

        const amount = parseFloat(withdrawAmount);

        // Validation check
        if (isNaN(amount) || amount <= 0) {
            setMessage('Enter a valid amount.');
            return;
        }
        if (amount > rewards) {
            setMessage(`You don't have enough rewards.`);
            return;
        }
        if (rewards < 10) {
            setMessage('You need at least $10 to withdraw.');
            return;
        }
        if (amount % 5 !== 0) {
            setMessage('You can only withdraw in multiples of $5');
            return;
        }

        try {
            // Insert withdrawal request
            const { data, error: insertError } = await supabase
                .from('withdrawals')
                .insert({
                    user_id: userId,
                    amount,
                    status: 'pending',
                });

            if (insertError) {
                setMessage('Error creating withrawal request.');
                console.error('Error creating withdrawal request.', insertError.message);
                return;
            } else {
                console.log('Withdrawal request inserted: ', data)
            }

            setTimeout(async () => {
                const status = Math.random() > 0.5 ? 'completed' : 'failed';

                const { error: statusError } = await supabase
                    .from('withdrawals')
                    .update({ status })
                    .eq('user_id', userId)
                    .eq('amount', amount);

                if (statusError) {
                    console.error('Error updating withdrawals status: ', statusError.message);
                } else {
                    console.log(`Withdrawal status updated to ${status}.`);
                    setMessage(`Withdrawal ${status}.`);
                }
            }, 5000);

            // Update user's rewards in Supabase
            const newRewards = rewards - amount;

            const { error: updateError } = await supabase
                .from('users')
                .update({ rewards: newRewards })
                .eq('id', userId);

            if (updateError) {
                setMessage('Error updating rewards.');
                console.error('Error updating rewards: ', updateError.message);
            } else {
                // Update rewards locally
                setRewards(newRewards);
                setMessage('Withdrawal request submitted successfully.');
                setWithdrawAmount('');
            }
        } catch (error) {
            console.error('Unexpected error: ', error.message);
            setMessage('An unexpected error occured.');
        }
    };

    return (
        <div className='withdraw'>
            <h3>Withdraw Funds</h3>
            <input
                type='number'
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder='Amount to withdraw'
            />
            <button onClick={handleWithdraw}>Withdraw</button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Withdraw;
