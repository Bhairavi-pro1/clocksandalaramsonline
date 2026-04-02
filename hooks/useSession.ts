'use client'

import { useState, useEffect } from 'react';

function generateRandomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let storedId = localStorage.getItem('caoSessionId');
    if (!storedId) {
      storedId = generateRandomId();
      localStorage.setItem('caoSessionId', storedId);
    }
    setSessionId(storedId);
  }, []);

  return { sessionId };
}
