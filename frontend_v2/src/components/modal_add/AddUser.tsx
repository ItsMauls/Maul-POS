"use client"
import { useState, SyntheticEvent, useEffect, useLayoutEffect } from "react";
import Modal from '../Modal';
import Cookies from 'js-cookie';
import { createUser } from "@/constants/types";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/constants/api";
import Button from "../Button";

interface AddUserProps {
    title: string;
    onSuccess: () => void;
}

export default function AddUser({ title, onSuccess }: AddUserProps) {
    const [user, setUser] = useState<createUser>();
    const [roles, setRoles] = useState<{ id: number, name: string }[]>([]);
    const { refreshToken } = useAuth();

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }

        const fetchRoles = async () => {
            const token = Cookies.get('access_token');
            if (!token) {
                alert("Access token is missing. Please log in.");
                return;
            }

            try {
                const response = await fetch(api.user.allRole, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data && data.data) {
                    setRoles(data.data);
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    const [userData, setUserData] = useState<createUser>({
        name: '',
        username: '',
        email: '',
        password: '',
        address: '',
        role_id: 0,
    });

    const [error, setError] = useState<string>('');
    const [modal, setModal] = useState<boolean>(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: name === 'role_id' ? parseInt(value) : value
        });
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        const token = Cookies.get('access_token');
        if (!token) {
            alert("Access token is missing. Please log in.");
            return;
        }

        try {
            const response = await fetch(api.user.addUser, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (data.error) {
                setError(data.error);
            } else {
                onSuccess();
                setModal(false);
            }
        } catch (err) {
            setError("An error occurred while creating the user.");
        }
    }

    function toggleModal() {
        setModal(!modal);
    }

    useLayoutEffect(() => {
        function handleKeyboardEvent(e: KeyboardEvent) {
            switch (e.key) {
                case 'Insert':
                    setModal(true);
                    break;
                case 'Escape':
                    setModal(false);
                    break;
                default:
                    break;
            }
        }

        window.addEventListener('keydown', handleKeyboardEvent);

        return () => {
            window.removeEventListener('keydown', handleKeyboardEvent);
        };
    }, []);

    return (
        <div>
            
            <Button
                className="bg-[#09A599] text-white px-4 py-2 rounded"
                onClick={toggleModal}
                label="Add User"
                shortcut="Insert"
            />
            <Modal title={title} isOpen={modal} onClose={toggleModal} size="md">
                <div className="bg-[#FFFFFF] rounded-xl p-4 m-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium">Nama</label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name"  
                                placeholder="Nama" 
                                value={userData.name} 
                                onChange={handleChange} 
                                className="w-full border rounded-lg h-10 p-2 bg-[#F9FAFC]"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="username" className="block mb-2 text-sm font-medium">Username</label>
                            <input 
                                type="text" 
                                name="username" 
                                id="username"  
                                placeholder="Username" 
                                value={userData.username} 
                                onChange={handleChange} 
                                className="w-full border rounded-lg h-10 p-2 bg-[#F9FAFC]"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email"  
                                placeholder="Email" 
                                value={userData.email} 
                                onChange={handleChange} 
                                className="w-full border rounded-lg h-10 p-2 bg-[#F9FAFC]"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password"  
                                placeholder="Password" 
                                value={userData.password} 
                                onChange={handleChange} 
                                className="w-full border rounded-lg h-10 p-2 bg-[#F9FAFC]"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="address" className="block mb-2 text-sm font-medium">Address</label>
                            <input 
                                type="text" 
                                name="address" 
                                id="address"  
                                placeholder="Address" 
                                value={userData.address} 
                                onChange={handleChange} 
                                className="w-full border rounded-lg h-10 p-2 bg-[#F9FAFC]"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="role_id" className="block mb-2 text-sm font-medium">Role</label>
                            <select 
                                name="role_id" 
                                id="role_id" 
                                value={userData.role_id} 
                                onChange={handleChange} 
                                className="w-full border rounded-lg h-10 p-2 bg-[#F9FAFC]"
                            >
                                <option value={0}>Select a role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        {error && <div className="text-red-500 mb-2">{error}</div>}
                        <div className="flex justify-end">
                            <button
                                className="bg-[#09A599] text-white px-4 py-2 rounded" 
                                type="submit" 
                            >Submit
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
