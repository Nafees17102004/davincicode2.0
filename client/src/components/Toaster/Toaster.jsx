import React from "react";

const Toast = ({ messages, removeToast }) => {
  // Safely handle messages prop
  const toastMessages = React.useMemo(() => {
    if (!messages) return [];
    if (!Array.isArray(messages)) return [];
    return messages.filter(
      (toast) => toast && typeof toast === "object" && toast.id && toast.message
    );
  }, [messages]);

  if (toastMessages.length === 0) {
    return null;
  }

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      {toastMessages.map((toast) => (
        <div
          key={toast.id}
          className={`toast show ${
            toast.type === "success"
              ? "bg-success"
              : toast.type === "error"
              ? "bg-danger"
              : toast.type === "warning"
              ? "bg-warning"
              : "bg-info"
          }`}
          role="alert"
        >
          <div className="toast-header">
            <strong className="me-auto">
              {toast.type === "success"
                ? "Success"
                : toast.type === "error"
                ? "Error"
                : toast.type === "warning"
                ? "Warning"
                : "Info"}
            </strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => removeToast && removeToast(toast.id)}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body text-white">
            {toast.message || "Notification"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
