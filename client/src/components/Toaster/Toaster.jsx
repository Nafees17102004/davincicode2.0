import React from "react";
import { ToastContainer, Toast } from "react-bootstrap";

function Toaster({ toastData, showToast, setShowToast, currentToast }) {
  return (
    <ToastContainer position="top-end" className="p-3">
      {/* {currentToast && (
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg={currentToast.variant}
          delay={2500}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">
              {currentToast.variant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="bg-white">{currentToast.text}</Toast.Body>
        </Toast>
      )} */}
      {toastData.map((toast, index) => (
        <Toast
          key={index}
          show={showToast}
          onClose={() => setShowToast(false)}
          bg={toast.variant}
          delay={5000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">
              {toast.variant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="bg-white">{toast.text}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}

export default Toaster;
