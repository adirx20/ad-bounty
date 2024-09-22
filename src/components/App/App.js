import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import Auth from '../Auth/Auth';
import Dashboard from '../Dashboard/Dashboard';
import Profile from '../Profile/Profile';
import Header from '../Header/Header';
import './App.css';

function App() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch current session
        const fetchSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error getting session: ', error.message);
            } else {
                setUser(session?.user);
            }
        };

        fetchSession(); // Call the async function

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user);
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error logging out: ', error.message);
        } else {
            setUser(null);
        }
    };

    return (
        <Router>
            <div className='app'>
                {user ? (
                    <>
                        <Header handleLogout={handleLogout} />
                        <Routes>
                            <Route
                                path='/profile'
                                element={<Profile user={user} />}
                            />
                            <Route
                                path='/dashboard'
                                element={<Dashboard user={user} />}
                            />
                            <Route
                                path='/'
                                element={<Dashboard user={user} />}
                            />
                        </Routes>
                    </>
                ) : (
                    <Routes>
                        <Route
                            path='/'
                            element={<Auth setUser={setUser} />}
                        />
                    </Routes>
                )}
            </div>
        </Router>
    );
}

export default App;
