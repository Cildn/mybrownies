// lib/hooks/use-session.ts
import { useState, useEffect } from 'react';

// Session expiration time (24 hours)
const SESSION_EXPIRATION_MS = 24 * 60 * 60 * 1000;

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate a new session ID
  const generateSessionId = (): string => {
    return 'session_' + Math.random().toString(36).substring(2, 15) + 
           Date.now().toString(36);
  };

  // Validate existing session
  const validateSession = (storedSession: string | null): boolean => {
    if (!storedSession) return false;
    
    try {
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.id || !sessionData.createdAt) return false;

      // Check if session is expired
      const sessionAge = Date.now() - new Date(sessionData.createdAt).getTime();
      const isSessionExpired = sessionAge >= SESSION_EXPIRATION_MS;
      
      if (isSessionExpired) {
        // Clean up expired session
        localStorage.removeItem('ecommerce_session');
        return false;
      }
      
      return !isSessionExpired;
    } catch {
      return false;
    }
  };

  // Initialize or renew session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        let sessionData = null;
        const storedSession = localStorage.getItem('ecommerce_session');

        if (storedSession && validateSession(storedSession)) {
          sessionData = JSON.parse(storedSession);
        } else {
          // Create new session if no valid session exists
          const newSession = {
            id: generateSessionId(),
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('ecommerce_session', JSON.stringify(newSession));
          sessionData = newSession;
        }

        setSessionId(sessionData.id);
        setIsLoading(false);
      } catch (err) {
        console.error('Session initialization error:', err);
        setError('Failed to initialize session');
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Optional: Refresh session logic
  const refreshSession = () => {
    const newSession = {
      id: generateSessionId(),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('ecommerce_session', JSON.stringify(newSession));
    setSessionId(newSession.id);
  };

  return { 
    sessionId, 
    isLoading, 
    error,
    refreshSession 
  };
}
