import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Invitation } from '../types';
import { PublishedInvitationView } from '../components/published/PublishedInvitationView';
import { Loader2, AlertCircle } from 'lucide-react';

interface PublicViewerPageProps {
  slug: string;
}

export const PublicViewerPage: React.FC<PublicViewerPageProps> = ({ slug }) => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublished = async () => {
      try {
        setIsLoading(true);
        const data = await api.getPublishedInvitationBySlug(slug);
        setInvitation(data);
      } catch (err: any) {
        setError(err?.message || 'Invitation not found or not published.');
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) {
      fetchPublished();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-300 gap-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
          Unfolding Digital Invitation...
        </span>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center text-neutral-300">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-neutral-100 mb-2">Invitation Unavailable</h2>
        <p className="text-xs text-neutral-400 max-w-sm mb-6">
          {error || 'This digital invitation is either in draft mode or the link is incorrect.'}
        </p>
        <a
          href="#/"
          className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors"
        >
          Return to Studio Home
        </a>
      </div>
    );
  }

  return <PublishedInvitationView invitation={invitation} isLiveViewer={true} />;
};
