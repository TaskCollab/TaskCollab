import React from "react";
import { Modal } from "react-bootstrap";
import "./modal.css";

interface GenericModalProps {
  id: string;
  size?: "sm" | "lg" | "xl";
  content: React.ReactNode;
  centered?: boolean;
  show: boolean; // Add 'show' prop
  onHide: () => void; // Add 'onHide' prop
  [key: string]: any;
}

const GenericModal: React.FC<GenericModalProps> = (props) => {
  const { id, size = "lg", content, centered = false, show, onHide, ...rest } = props;

  return (
    <Modal
      {...rest}
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      centered={centered}
      id={id}
      show={show} // Use the 'show' prop
      onHide={onHide} // Use the 'onHide' prop
    >
      {content}
    </Modal>
  );
};

export default GenericModal;