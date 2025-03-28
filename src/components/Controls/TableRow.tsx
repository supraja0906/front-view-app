import React from 'react';
import styles from './Control.module.css';
import { TableRowProps, isSaControl } from '../../types/types.ts';

export const TableRow: React.FC<TableRowProps> = ({ control, onEdit, onDelete }) => {
  return (
    <div className={styles.tableCellRow}>
      
      <div className={styles.cell}>
        <div className={styles.cellContent}>{control.name}</div>
      </div>
      <div className={styles.cell}>
        <div className={styles.cellContent}>{isSaControl(control) ? control.entName : control.ent1Name}</div>
      </div>
      <div className={styles.cell}>
        <div className={styles.cellContent}>{control.ent2Name}</div>
      </div>
      <div className={styles.actionCell}>
        <button
          className={styles.actionButton}
          onClick={() => onEdit(control)}
          aria-label={`Edit ${control.name}`}
        >
          <div className={styles.buttonContent}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/290a98c58fd6ff11b6bb3c974f3f49ea50375d611a7fc5c322ece00569ad5402?placeholderIfAbsent=true&apiKey=a425ac4ee7f44c4e8f299e4382456740"
              className={styles.buttonIcon}
              alt="Edit"
            />
            <span className={styles.buttonText}>Edit</span>
          </div>
        </button>
        <button
          className={styles.actionButton}
          onClick={() => onDelete(control.id)}
          aria-label={`Delete ${control.name}`}
        >
          <div className={styles.buttonContent}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2dece34272e8ea9ad59a9c4539c5fa65e60c9c38463f6b19ce518fa8c1a8f0f9?placeholderIfAbsent=true&apiKey=a425ac4ee7f44c4e8f299e4382456740"
              className={styles.buttonIcon}
              alt="Delete"
            />
            <span className={styles.buttonText}>Delete</span>
          </div>
        </button>
      </div>
    </div>
  );
};