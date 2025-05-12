import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import Button from '../ui/button/Button';
import {
  CREATE_USER,
  SEND_AGENT_EMAIL,
  VALIDATE_USER_BY_EMAIL,
  CHECK_QR_CODE_BY_CODE,
  VALIDATE_QR_CODE,
} from '@/lib/graphql/mutations/campaign';
import { useRouter } from 'next/navigation';

interface RegisterFormModalProps {
  onClose: () => void;
  qrCode: string;
}

export default function RegisterFormModal({ onClose, qrCode }: RegisterFormModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQRValid, setIsQRValid] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);

  const [createUser] = useMutation(CREATE_USER);
  const [sendAgentEmail] = useMutation(SEND_AGENT_EMAIL);
  const [validateQRCodeMutation] = useMutation(VALIDATE_QR_CODE);

  const { data: validateUserData, loading: validateLoading } = useQuery(
    VALIDATE_USER_BY_EMAIL,
    {
      variables: { email },
      skip: !email,
    }
  );

  const [checkQRCode, { loading: checkLoading, data: qrCheckData }] = useLazyQuery(
    CHECK_QR_CODE_BY_CODE
  );

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFullName || !trimmedEmail) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Prevent duplicate emails
      if (validateUserData?.validateUserByEmail) {
        setError('This email is already registered.');
        setIsSubmitting(false);
        return;
      }

      // 2. Create user
      const { data: createUserResult } = await createUser({
        variables: {
          input: {
            fullName: trimmedFullName,
            email: trimmedEmail,
          },
        },
      });

      const createdAgentId = createUserResult?.createUser?.agentId;
      if (!createdAgentId) {
        setError('Failed to generate agent ID.');
        setIsSubmitting(false);
        return;
      }
      setAgentId(createdAgentId);

      // 3. Send agent email
      await sendAgentEmail({
        variables: {
          input: {
            agentId: createdAgentId,
            fullName: trimmedFullName,
            email: trimmedEmail,
          },
        },
      });

      // 4. Validate QR code against agent
      const { data: validateQrResult } = await validateQRCodeMutation({
        variables: { input: { code: qrCode, agentId: createdAgentId } },
      });
      if (!validateQrResult?.validateQRCode) {
        setError('QR code validation failed. Please contact support.');
        setIsSubmitting(false);
        return;
      }

      // 5. Success!
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDoneClick = () => {
    if (agentId) {
      router.push(`/brownie-city/dashboard/${agentId}`);
    }
    onClose();
  };

  // pre-check QR code availability for UI enable/disable
  useEffect(() => {
    const validateQR = async () => {
      try {
        await checkQRCode({ variables: { code: qrCode } });
      } catch (err) {
        setError('QR code validation failed. Please try again.');
        console.error(err);
      }
    };
    validateQR();
  }, [qrCode, checkQRCode]);

  useEffect(() => {
    if (qrCheckData?.checkQRCodeByCode) {
      if (qrCheckData.checkQRCodeByCode.isValid) {
        setIsQRValid(true);
      } else {
        setError(qrCheckData.checkQRCodeByCode.reason || 'Invalid QR code');
        setIsQRValid(false);
      }
    }
  }, [qrCheckData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4">Register for Brownie City</h2>

        {success ? (
          <div>
            <p className="text-green-600 mb-4">
              Registration successful! Check your email for your Agent ID.
            </p>
            <Button onClick={handleDoneClick}>Done</Button>
          </div>
        ) : (
          <>
            {!isQRValid && error ? (
              <div className="text-red-600 mb-4">{error}</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-600 mb-2">{error}</p>}

                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                  disabled={isSubmitting}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                  disabled={isSubmitting}
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      validateLoading ||
                      checkLoading ||
                      !isQRValid
                    }
                  >
                    {isSubmitting || validateLoading || checkLoading
                      ? 'Registering…'
                      : 'Register'}
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}