'use client';

import { Modal } from 'flowbite-react';

export default function ModalContainer({
    children,
  }: {
    children: React.ReactNode
  }) {
//   const props = { openModal, setOpenModal };

  return (
    <>
      <Modal dismissible show={true} onClose={() => false}>
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
      </Modal>
    </>
  )
}


