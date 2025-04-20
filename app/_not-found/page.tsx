// app/not-found.tsx or app/_not-found/page.tsx

import { Suspense } from 'react';
import SearchParamClient from './not-found-page';

export default function NotFound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamClient />
      </Suspense>
    </div>
  );
}
