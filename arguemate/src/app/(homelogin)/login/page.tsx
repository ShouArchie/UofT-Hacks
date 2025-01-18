'use client';

import React, { useState } from 'react';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    setError(null);
    console.log('Email:', email, 'Password:', password);

    if (email === 'test@example.com' && password === 'password') {
      alert('Login successful!');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-poppins">
      <h1 className="text-2xl font-bold mb-6 font-poppins">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-poppins">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-poppins"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-poppins">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-poppins"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4 font-poppins">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-poppins"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;