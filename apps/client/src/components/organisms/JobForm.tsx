import { useState, useRef } from 'react';
import { Input, Select } from '../atoms/FormElements';
import { Button } from '../atoms/Button';
import type { LocationType, Job } from '@mern/types';

type OnSubmit = (data: Pick<Job, 'caseName' | 'duration' | 'locationType' | 'locationName'>) => void;

interface JobFormProps {
  onSubmit: OnSubmit;
  isLoading: boolean;
}

export const JobForm: React.FC<JobFormProps> = ({ onSubmit, isLoading }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [locationType, setLocationType] = useState<LocationType>('remote');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = {
      caseName: formData.get('case_name') as string,
      duration: parseInt(formData.get('duration') as string),
      locationType: formData.get('location_type') as LocationType,
      locationName: formData.get('location_name') as string || '',
    };

    onSubmit(data);
    formRef.current.reset();
    setLocationType('remote');
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card glass">
      <h2 style={{ marginBottom: '1.5rem' }}>Create New Job</h2>
      <div className="form-grid">
        <Input
          label="Case Name"
          id="case-name"
          name="case_name"
          required
          placeholder="e.g. Smith vs Jones"
        />
        <Input
          label="Duration (minutes)"
          type="number"
          id="duration"
          name="duration"
          defaultValue={30}
          required
          placeholder="Enter duration in minutes"
        />
        <Select
          label="Location Type"
          name="location_type"
          value={locationType}
          onChange={(e) => setLocationType(e.target.value as LocationType)}
          options={[
            { label: 'Remote', value: 'remote' },
            { label: 'Physical', value: 'physical' },
          ]}
        />
        {locationType === 'physical' && (
          <Input
            label="City / Location Name"
            id="location-name"
            name="location_name"
            required
            placeholder="e.g. Jakarta"
          />
        )}
      </div>
      <Button type="submit" isLoading={isLoading} style={{ marginTop: '1rem', width: '100%' }}>
        Create Job
      </Button>
    </form>
  );
};
