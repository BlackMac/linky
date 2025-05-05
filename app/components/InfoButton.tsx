'use client';

export function InfoButton({ modalId }: { modalId: string }) {
  return (
    <button 
      className="btn btn-circle btn-xs btn-ghost"
      onClick={(e) => {
        e.preventDefault();
        (document.getElementById(modalId) as HTMLDialogElement)?.showModal();
      }}
    >
      <span className="font-serif italic">i</span>
    </button>
  );
}