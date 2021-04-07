import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';

interface NewFolderModalProps {
  folderModalOpen: boolean
  onCloseModal: any
  callback: any
}

Modal.setAppElement('#root');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-70%',
    transform             : 'translate(-70%, -70%)',
    color: "black"
  }
};

export default function NewFolderModal({folderModalOpen, onCloseModal, callback}: NewFolderModalProps) {
  const [stuffInsideTextBox, setStuffInsideTextBox] = useState("")

  const slugChange = (event: any) => {
    setStuffInsideTextBox(event.target.value)
  }

  const clickedOnContinueButton = () => {
    callback(stuffInsideTextBox);
    onCloseModal();
  }

  const onKeypressEvent = (event: any) => {
    if (event.key === "Enter") {
      console.log(stuffInsideTextBox)
      callback(stuffInsideTextBox);
      onCloseModal();
    }
  }

  useEffect(() => {
    if (folderModalOpen) window.addEventListener("keypress", onKeypressEvent)
    return () => window.removeEventListener("keypress", onKeypressEvent)
  }, [stuffInsideTextBox])

  return (
    <Modal
      isOpen={folderModalOpen}
      onRequestClose={() => onCloseModal()}
      contentLabel="Example Modal"
      style={customStyles}
    >
      <h2>Enter new folder name:</h2>
      <input value={stuffInsideTextBox} onChange={slugChange} />
      <button type="button" onClick={() => onCloseModal()}>Cancel</button>
      <button type="button" onClick={clickedOnContinueButton}>Continue</button>
    </Modal>
  )
}
