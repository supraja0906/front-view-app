import React, { useState, useEffect } from 'react';
import styles from './Campaign.module.css';
import { Campaign } from '../../types/types.ts';
import { CampaignTable } from './CampaignTable.tsx';
import {CampaignModal} from './CampaignModal.tsx'
import { API_ENDPOINTS } from '../../types/api.ts';
import Create from './Create.png';
import { DeleteModal } from './DeleteModal.tsx';

export const CampaignComponent: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>();
  const [successMessage, setSuccessMessage] = useState(''); // State to manage the success message
  const [errorMessage,setErrorMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CAMPAIGNS, {credentials: "include"});
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    }
    
    fetchCampaigns();

    const intervalId = setInterval(fetchCampaigns, 60*1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDeleteClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteModalOpen(true);
  };

  const handleDownload = async (campaign: Campaign) => {
    try {
      const response = await fetch(
        API_ENDPOINTS.CAMPAIGN_DOWNLOAD(campaign.name),
        {
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();

      // Create a URL for the blob and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports_${campaign.name}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading campaign reports:', error);
    }
  };



  const handleStartClick = async (campaign: Campaign) => {
    const method ='POST';
    try {
      await fetch(API_ENDPOINTS.DOWNLOAD_CAMPAIGNS, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });
      setIsModalOpen(false);
      fetchCampaigns();

    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleSubmit = async (campaign: Campaign) => {
    let response;

    try {
      if (selectedCampaign) {
        response = await fetch(`${API_ENDPOINTS.CONNECTIONS}/${campaign.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaign),
        });
      } else {
        response = await fetch(`${API_ENDPOINTS.CAMPAIGN_START(campaign.name)}`);
      }
    

      if (!response.ok) {
        setErrorMessage(`HTTP error! Status: ${response.status}`);
        setTimeout(() => setErrorMessage(''), 5000);
      }

      setSuccessMessage('Created Campaign Successfully!');  // Set success message
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      setIsModalOpen(false);
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      setErrorMessage('Failed to save campaign.');  // Set error message when saving campaign fails
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }

  };

  const handleCreateCampaign = () => {
    // setSelectedCampaign({
    //   id: '',
    //   name: '',
    //   status: '',
    //   violationCount: '',
    //   connectionId: '',
    //   controls: []
    // });
    setIsModalOpen(true);
  };


  const handleEdit = (campaign: Campaign) => {
      setSelectedCampaign(campaign);
      setIsModalOpen(true);
    };
  
  const handleDeleteConfirm = async (name: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.CAMPAIGNS}/${name}`, { method: 'DELETE' });
      
      if (!response.ok) {
        setErrorMessage(`HTTP error! Status: ${response.status}`);
        setTimeout(() => setErrorMessage(''), 5000);
      }

      setSuccessMessage('Deleted Connection Successfully!');  // Set success message
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      fetchCampaigns();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting Connections:', error);
      setErrorMessage('Failed to deleting Connections.');  // Set error message when saving campaign fails
      
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    } finally {
      setSelectedCampaign(undefined);
    }
  };
  
    
 

  return (
        <div className={styles.container}>
            {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
          <div className={styles.header}>
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>Campaigns</h1>
            </div>
            <button className={styles.createButton} onClick={handleCreateCampaign}>
  <div className={styles.buttonContent}>
    <img
      loading="lazy"
      src={Create}
      alt="Create Icon"
      className={styles.buttonIcon}
    />
    <span className={styles.buttonText}>Create</span>
  </div>
</button>
          </div>
      <div className={styles.content}>
        <CampaignTable
          campaigns={campaigns}
          onDownload={handleDownload}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onStart={handleStartClick}
        />
      </div>
      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaign={selectedCampaign}
        onSubmit={handleSubmit}
      />
     <DeleteModal
             isOpen={isDeleteModalOpen}
             onClose={() => setIsDeleteModalOpen(false)}
             campaign={selectedCampaign}
             onConfirm={handleDeleteConfirm}
           />
    </div>
  );
};