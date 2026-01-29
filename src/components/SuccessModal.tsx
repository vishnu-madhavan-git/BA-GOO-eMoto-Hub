import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  referenceId?: string;
}

export function SuccessModal({ isOpen, onClose, title, message, referenceId }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass-card p-8 max-w-md w-full text-center animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{message}</p>

        {referenceId && (
          <div className="bg-secondary rounded-xl p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-1">Reference ID</p>
            <p className="font-mono text-primary font-semibold">{referenceId}</p>
          </div>
        )}

        <button onClick={onClose} className="btn-primary w-full">
          Got it
        </button>
      </div>
    </div>
  );
}
