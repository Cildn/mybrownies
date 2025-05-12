import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Button from '../ui/button/Button';

// Use your provided query
export const VALIDATE_USER_CREDENTIALS = gql`
  query ValidateUserCredentials($agentId: String!, $email: String!) {
    validateUserCredentials(agentId: $agentId, email: $email)
  }
`;

interface EnterFormModalProps {
  onClose: () => void;
}

export default function EnterFormModal({ onClose }: EnterFormModalProps) {
  const [agentId, setAgentId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [validateUserCredentials, { loading }] = useLazyQuery(
    VALIDATE_USER_CREDENTIALS,
    {
      fetchPolicy: 'network-only',
      onError: () => setError('Could not validate credentials.'),
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedAgentId = agentId.trim();
    const trimmedEmail = email.trim();

    if (!trimmedAgentId || !trimmedEmail) {
      setError('Both fields are required.');
      return;
    }

    try {
      const { data } = await validateUserCredentials({
        variables: {
          agentId: trimmedAgentId,
          email: trimmedEmail,
        },
      });

      if (!data?.validateUserCredentials) {
        setError('Invalid credentials — check your Agent ID and email.');
        return;
      }

      // Credentials valid, navigate to the dashboard
      router.push(`/brownie-city/dashboard/${agentId}`);
    } catch (err) {
      console.error(err);
      setError('Failed to validate credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4">Enter Brownie City</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Agent ID"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Verifying…' : 'Enter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
