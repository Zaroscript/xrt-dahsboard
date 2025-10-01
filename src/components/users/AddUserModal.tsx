import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddUserForm } from './AddUserForm';
import { useAppDispatch } from '@/store/store';
import { addNotification } from '@/store/slices/notificationsSlice';

export const AddUserModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleSuccess = () => {
    setIsOpen(false);
    dispatch(addNotification({
      title: 'New User Added',
      description: 'A new user has been successfully added to the system.',
    }));
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add User
      </Button>

      <AnimatePresence>
        {isOpen && (
          <AddUserForm 
            onSuccess={handleSuccess} 
            onCancel={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AddUserModal;
