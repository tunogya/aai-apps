import React from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(
  async function SSRPage() {
    const session = getSession();
    return (
      <div>
        chat
      </div>
    );
  },
  { returnTo: '/chat' }
);