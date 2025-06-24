import styles from "./PaymentMethodPopup.module.scss";
import Button from "waitr-fe/src/base_components/Button/Button";

interface PaymentMethodPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPaymentMethod: (method: "cash" | "card") => void;
  isLoading: boolean;
}

const PaymentMethodPopup = (props: PaymentMethodPopupProps) => {
  const { isOpen, onClose, onSelectPaymentMethod, isLoading } = props;
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2>Selectează metoda de plată</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.content}>
          <Button
            text="Cash"
            color="brand"
            tall
            onClick={() => onSelectPaymentMethod("cash")}
            loading={isLoading}
            disabled={isLoading}
          />
          <Button
            text="Card"
            color="brand"
            tall
            onClick={() => onSelectPaymentMethod("card")}
            loading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPopup;
