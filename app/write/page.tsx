import React from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0/edge';
import NovelEditor from "../components/NovelEditor";
export default withPageAuthRequired(
  async function SSRPage() {
    const session = getSession();
    return (
      <div className={'w-full h-full'}>
        <NovelEditor />
      </div>
    );
  },
  { returnTo: '/write' }
);