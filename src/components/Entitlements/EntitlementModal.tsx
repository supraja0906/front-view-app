import React, { useState, useEffect } from 'react';
import styles from './EntitlementModal.module.css';
import { EntitlementModalProps, Entitlement } from './types';

export const EntitlementModal: React.FC<EntitlementModalProps> = ({
  isOpen,
  onClose,
  entitlement,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Entitlement>({
    name: '',
    accessSet: [],
  });

  const [functions, setFunctions] = useState([]);

  useEffect(() => {
    fetchFunctions();
    if (entitlement) {
      setFormData({
        name: entitlement.name,
        accessSet: entitlement.accessSet.map((access: any) => ({
          id: access.id,
          name: access.name,
        })),
      });
    } else {
      setFormData({
        name: '',
        accessSet: [],
      });
    }
  }, [entitlement]);

  const fetchFunctions = async () => {
    try {
      const response = await fetch('http://localhost:4000/accessSet');
      const data = await response.json();
      setFunctions(data);
    } catch (error) {
      console.error('Error fetching functions:', error);
    }
  };

  const handleAddFunction = (functionId: string) => {
    const functionToAdd = functions.find((func) => func.id === functionId);
    if (functionToAdd && !formData.accessSet.some((access) => access.id === functionId)) {
      setFormData({
        ...formData,
        accessSet: [...formData.accessSet, functionToAdd],
      });
    }
  };

  const handleRemoveFunction = (functionId: string) => {
    setFormData({
      ...formData,
      accessSet: formData.accessSet.filter((access) => access.id !== functionId),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <h2 className={styles.modalTitle}>
          {entitlement ? 'Edit Entitlement' : 'Create Entitlement'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <label htmlFor="name">Entitlement Name</label>
          </div>

          {/* Dropdown to select functions */}
          <div className={styles.formField}>
            <select
              className={styles.dropdown}
              onChange={(e) => handleAddFunction(e.target.value)}
              value=""
            >
              <option value="" disabled>
                Select a function
              </option>
              {functions
                .filter((func) => !formData.accessSet.some((access) => access.id === func.id))
                .map((func) => (
                  <option key={func.id} value={func.id}>
                    {func.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Display selected functions below */}
          <div className={styles.selectedList}>
            {formData.accessSet.map((selected) => (
              <div key={selected.id} className={styles.selectedItem}>
                {selected.name}
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveFunction(selected.id)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {entitlement ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};