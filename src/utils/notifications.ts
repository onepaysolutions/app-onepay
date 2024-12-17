import { toast, ToastOptions } from "react-toastify";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertOptions extends ToastOptions {
  className?: string;
  duration?: 3000;
}

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const showAlert = (
  type: AlertType,
  message: string,
  options?: AlertOptions
) => {
  const { className, duration, ...toastOptions } = options || {};
  const finalOptions = {
    ...defaultOptions,
    ...toastOptions,
    autoClose: duration || defaultOptions.autoClose,
    className: className || "",
  };

  switch (type) {
    case "success":
      toast.success(message, finalOptions);
      break;
    case "error":
      toast.error(message, finalOptions);
      break;
    case "warning":
      toast.warn(message, finalOptions);
      break;
    case "info":
      toast.info(message, finalOptions);
      break;
    default:
      break;
  }
};

export const showSuccessAlert = (message: string, options?: AlertOptions) => {
  showAlert("success", message, options);
};

export const showErrorAlert = (message: string, options?: AlertOptions) => {
  showAlert("error", message, options);
};

export const showWarningAlert = (message: string, options?: AlertOptions) => {
  showAlert("warning", message, options);
};

export const showInfoAlert = (message: string, options?: AlertOptions) => {
  showAlert("info", message, options);
};
