import Toast from './Toast';
import { useToastStore } from '../../store/toastStore';

function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2">
      {toasts.map(({ id, message, type }) => (
        <Toast
          key={id}
          message={message}
          type={type}
          onDismiss={() => removeToast(id)}
        />
      ))}
    </div>
  );
}

export default ToastProvider;
