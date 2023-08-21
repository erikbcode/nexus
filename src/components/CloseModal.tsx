'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';

const CloseModal = () => {
  const router = useRouter();
  return (
    <div>
      <Button variant="subtle" onClick={() => router.back()}>
        X
      </Button>
    </div>
  );
};

export default CloseModal;
