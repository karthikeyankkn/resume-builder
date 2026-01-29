import { useEffect, useState } from 'react';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

const toastTypes = {
  info: { icon: <Info />, barColor: 'bg-blue-500' },
  success: { icon: <CheckCircle />, barColor: 'bg-green-500' },
  warning: { icon: <AlertTriangle />, barColor: 'bg-yellow-500' },
  error: { icon: <AlertCircle />, barColor: 'bg-red-500' },
};

function Toast({ message, type, onDismiss }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { icon, barColor } = toastTypes[type] || toastTypes.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onDismiss, 300); // Wait for fade out animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(onDismiss, 300); // Wait for fade out animation
  };

  return (
    <div
      className={`flex items-center bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
        isFadingOut ? 'opacity-0 translate-y-4' : 'opacity-100'
      }`}
    >
      <div className={`w-2 h-full ${barColor}`} />
      <div className="p-3 flex items-center gap-3">
        <div className="flex-shrink-0 text-gray-600">{icon}</div>
        <p className="text-sm text-gray-700">{message}</p>
        <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-gray-100">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

export default Toast;
