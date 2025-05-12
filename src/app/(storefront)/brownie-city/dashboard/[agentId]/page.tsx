'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_USER_STATS,
  GET_CLUE_OF_THE_DAY,
  SUBMIT_CLUE_ANSWER,
} from '@/lib/graphql/mutations/campaign';
import Button from '@/components/ui/button/Button';

// Define interfaces
interface Clue {
  id: string;
  date: string;
  question: string;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  expiry: string;
}

interface BadgeUpgrade {
  id: string;
  badgeType: string;
  createdAt: string;
}

interface UserStats {
  id: string;
  agentId: string;
  email: string;
  fullName: string;
  points: number;
  badge: string;
  clues: Clue[];
  coupons: Coupon[];
  badgeUpgrades: BadgeUpgrade[];
}

interface GetUserStatsResponse {
  getUserStats: UserStats;
}

interface GetClueOfTheDayResponse {
  getClueOfTheDay: Clue;
}

interface SubmitClueAnswerResponse {
  submitClueAnswer: {
    correct: boolean;
    points: number;
    coupon?: Coupon;
  };
}

export default function DashboardPage() {
  const { agentId } = useParams<{ agentId: string }>() || { agentId: '' };
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<null | {
    correct: boolean;
    points: number;
    coupon?: Coupon;
  }>(null);

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<GetUserStatsResponse>(GET_USER_STATS, {
    variables: { agentId },
    fetchPolicy: 'network-only',
  });

  const {
    data: clueData,
    loading: clueLoading,
    error: clueError,
  } = useQuery<GetClueOfTheDayResponse>(GET_CLUE_OF_THE_DAY);

  const [submitClueAnswer, { loading: mutationLoading }] = useMutation<
    SubmitClueAnswerResponse
  >(SUBMIT_CLUE_ANSWER, {
    onCompleted: (data) => {
      setSubmitResult(data.submitClueAnswer);
      setAnswer('');
      refetchStats();
    },
    onError: (err) => {
      setSubmitError(err.message);
    },
  });

  if (statsLoading || clueLoading) {
    return <p className="font-mono text-gray-400">Loading dossier…</p>;
  }

  if (statsError || clueError) {
    return (
      <p className="font-mono text-red-500">
        {statsError?.message || clueError?.message || 'Case broken.'}
      </p>
    );
  }

  const user = statsData?.getUserStats;
  const clue = clueData?.getClueOfTheDay;

  if (!user || !clue) {
    return <p className="font-mono text-red-500">Case data missing.</p>;
  }

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitResult(null);
    if (!answer.trim()) {
      setSubmitError('Type your answer, gumshoe.');
      return;
    }
    submitClueAnswer({
      variables: {
        input: { agentId, email: user.email, answer: answer.trim() },
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 bg-[#efe1c6] bg-cover text-gray-800 font-serif">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2 border-b border-gray-600 pb-2 tracking-widest">
        CASE FILE: {user.fullName.toUpperCase()}
      </h1>
      <p className="italic mb-4">Agent ID: <span className="font-mono">{user.agentId}</span></p>
      <div className="flex gap-6 mb-6">
        <p>Points: <span className="font-semibold">{user.points}</span></p>
        <p>Badge: <span className="font-semibold">{user.badge}</span></p>
      </div>

      {/* Clue of the Day */}
      <section className="mb-8 p-6 bg-white bg-opacity-70 rounded-lg shadow-inner border border-gray-700">
        <h2 className="text-2xl font-bold mb-2 underline decoration-gray-700">
          Clue of the Day
        </h2>
        <p className="mb-4 italic">&#8220;{clue.question}&#8221;</p>

        {/* Submission Result */}
        {submitResult && (
          <div
            className={`mb-4 p-4 rounded ${
              submitResult.correct ? 'bg-green-100 border-green-700' : 'bg-red-100 border-red-700'
            } border-dashed border-2`}
          >
            {submitResult.correct ? (
              <p>
                <strong>✔ Correct!</strong> +{submitResult.points} points.
                {submitResult.coupon && (
                  <span>
                    <br />
                    <strong>Coupon:</strong> {submitResult.coupon.code} (
                    {submitResult.coupon.discount}% off) expires{' '}
                    {new Date(submitResult.coupon.expiry).toLocaleDateString()}.
                  </span>
                )}
              </p>
            ) : (
              <p><strong>✖ Incorrect.</strong> Try again, detective.</p>
            )}
          </div>
        )}

        {submitError && (
          <p className="mb-2 p-2 bg-red-50 text-red-700 border-l-4 border-red-700 font-mono">
            {submitError}
          </p>
        )}

        <form onSubmit={handleAnswerSubmit} className="flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
            className="flex-1 px-3 py-2 border border-gray-600 rounded bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-700 font-mono"
          />
          <Button
            type="submit"
            disabled={!answer.trim() || mutationLoading}
            className="bg-gray-800 hover:bg-gray-900 text-white font-mono tracking-widest"
          >
            {mutationLoading ? '…SUBMITTING' : 'SUBMIT'}
          </Button>
        </form>
      </section>

      {/* History */}
      <section className="mb-8 p-6 bg-white bg-opacity-70 rounded-lg shadow-inner border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 underline decoration-gray-700">
          Investigation Log
        </h2>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Clues Answered</h3>
          <ul className="list-disc list-inside font-mono">
            {user.clues.map((c) => (
              <li key={c.id}>
                [{new Date(c.date).toLocaleDateString()}] {c.question}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Coupons Redeemed</h3>
          <ul className="list-disc list-inside font-mono">
            {user.coupons.map((c) => (
              <li key={c.id}>
                {c.code} — {c.discount}% off (exp. {new Date(c.expiry).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Badge Upgrades</h3>
          <ul className="list-disc list-inside font-mono">
            {user.badgeUpgrades.map((b) => (
              <li key={b.id}>
                {b.badgeType} on {new Date(b.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Button
        onClick={() => router.back()}
        className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-mono tracking-widest"
      >
        🕵️‍♂️ EXIT CASE
      </Button>
    </div>
  );
}