import { AlertTriangle, ExternalLink } from 'lucide-react';
import { missingFirebaseEnv } from '../lib/firebase';

export default function FirebaseSetupNotice() {
  return (
    <section className="mx-auto my-10 max-w-2xl rounded-[2rem] border border-amber-300/30 bg-amber-300/10 p-6 text-amber-50 shadow-2xl shadow-black/30">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-300 text-slate-950">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Firebase setup required</h2>
          <p className="text-sm text-amber-100/80">Login and signup are paused because Firebase env variables are missing.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
        <p className="mb-3 text-sm font-semibold text-white">Add these in Vercel → Settings → Environment Variables:</p>
        <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-emerald-200">
{missingFirebaseEnv.length ? missingFirebaseEnv.join('\n') : 'Firebase env variables are configured.'}
        </pre>
      </div>

      <p className="mt-4 text-sm leading-6 text-amber-100/80">
        After adding them, redeploy the project without build cache. Also add <b>ai.webrion.online</b> in Firebase Authentication → Settings → Authorized domains.
      </p>

      <a
        href="https://console.firebase.google.com/"
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-4 py-3 text-sm font-black text-slate-950 hover:bg-amber-200"
      >
        Open Firebase Console <ExternalLink className="h-4 w-4" />
      </a>
    </section>
  );
}
