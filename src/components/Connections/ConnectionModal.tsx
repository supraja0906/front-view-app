import React, { useState, useEffect } from 'react';
import styles from './ConnectionModal.module.css';
import { ConnectionModalProps, Connection } from '../../types/types';
import { API_ENDPOINTS } from '../../types/api.ts';

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose: close,
  connection,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Connection>({
    id:'',
    name: '',
    host: '',
    port:'',
    db:'',
    user: '',
    password: ''
  });

  useEffect(() => {
    if (connection) {
      setFormData(connection);
    } else {
      setFormData({
        id: 0,
        name: '',
        host: '',
        port:'',
        db:'',
        user: '',
        password: ''
      });
    }
  }, [connection]);

  const onClose = () => {
    // Reset states to initial values when closing the modal
    setFormData({   id:'',
      name: '',
      host: '',
      port:'',
      db:'',
      user: '',
      password: '' });  // Clear any errors
    close();  // Call the onClose prop function to officially close the modal
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const [testMessage, setTestMessage] = useState('');

  const handleTestConnection = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TEST_CONNECTION, {
        method: 'POST', // Specify the method
        headers: {
          'Content-Type': 'application/json' // Specify the content type in the headers
        },
        body: JSON.stringify({ // Convert the formData to JSON
          host: formData.host,
          port: formData.port,
          user: formData.user,
          password: formData.password
        })
      });
      
      if (response.ok) { 
        setTestMessage('Connection successful!');
      } else {
        setTestMessage('Connection failed!');
      }
    } catch (error) {
      setTestMessage('Connection failed!');
    }
  };


  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <h2 className={styles.modalTitle}>
          {connection ? 'Edit Connection' : 'Create Connection'}
        </h2>
        <form onSubmit={handleSubmit}>
        <div className={styles.formField}>
  <input
    id="name"
    type="text"
    placeholder=" " // Placeholder for floating effect
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    required
  />
  <label htmlFor="name">Connection Name</label>
</div>
<div className={styles.formField}>
  <input
    id="host"
    type="text"
    placeholder=" "
    value={formData.host}
    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
    required
  />
  <label htmlFor="host">Host</label>
</div>
<div className={styles.formField}>
  <input
    id="port"
    type="text"
    placeholder=" "
    value={formData.port}
    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
    required
  />
  <label htmlFor="port">Port</label>
</div>
<div className={styles.formField}>
  <input
    id="db"
    type="text"
    placeholder=" "
    value={formData.db}
    onChange={(e) => setFormData({ ...formData, db: e.target.value })}
    required
  />
  <label htmlFor="db">db</label>
  </div>
<div className={styles.formField}>
  <input
    id="user"
    type="text"
    placeholder=" "
    value={formData.user}
    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
    required
  />
  <label htmlFor="user">User</label>
  </div>
<div className={styles.formField}>
  <input
    id="password"
    type="password"
    placeholder=" "
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    required
  />

<label htmlFor="password">Password</label>
</div>

          <div className={styles.modalActions}>
          <button type="submit" onClick={handleTestConnection} className={styles.submitButton}>
              Test Connection
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {connection ? 'Save' : 'Create'}
            </button>
          </div>
          {testMessage && <div className={styles.testMessage}>{testMessage}</div>}
        </form>
      </div>
    </div>
  );
};