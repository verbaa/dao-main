import { useState } from 'react';
import { useCreateProposal} from "../../hooks/useCreateProposal.ts";

import styles from './CreateProposalForm.module.scss';

const CreateProposalForm = () => {
  const [description, setDescription] = useState('');
  const { handleCreateProposal, isSigning } = useCreateProposal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const hash = await handleCreateProposal([description]);

    if (hash) {
      setDescription('');
    }
  };

  return (
    <div className={styles.card}>
      <h3>Create New Proposal</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          placeholder="Describe your proposal (e.g. 'Donate 100 ETH to charity')..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSigning}
          rows={3}
        />
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!description.trim() || isSigning}
        >
          {isSigning ? 'Signing...' : 'Create Proposal'}
        </button>
      </form>
    </div>
  );
};

export default CreateProposalForm;