import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import './WithdrawalHistory.css';

function WithdrawalHistory({ userId }) {

    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {

        const fetchWithdrawalHistory = async () => {

            setLoading(true);

            let query = supabase
                .from('withdrawals')
                .select('amount, status, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            // Apply filter for status
            if (filter !== 'all') {
                query = query.eq('status', filter);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching withdrawal history: ', error.message);
            } else {
                console.log('Fetched withdrawal data: ', data);
                setWithdrawals(data);
            }

            setLoading(false);
        };

        if (userId) {
            fetchWithdrawalHistory();
        }
    }, [userId, filter]);

    return (
        <div className='withdrawal-history_container'>
            <h3>Withdrawal History</h3>

            <div className='filter-options'>
                <label>Filter by Status: </label>
                <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                    <option value='all'>All</option>
                    <option value='pending'>Pending</option>
                    <option value='completed'>Completed</option>
                    <option value='failed'>Failed</option>
                </select>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : withdrawals.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals.map((withdrawal, index) => (
                            <tr key={index}>
                                <td>${withdrawal.amount.toFixed(2)}</td>
                                <td>{withdrawal.status}</td>
                                <td>{new Date(withdrawal.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No withdrawals found.</p>
            )}
        </div>
    );
}

export default WithdrawalHistory;
