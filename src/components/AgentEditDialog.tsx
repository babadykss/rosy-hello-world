
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface AgentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  agentUID: string;
  currentNickname?: string;
  onRename: (oldUID: string, newUID: string) => void;
  onDelete: (uid: string) => void;
}

const AgentEditDialog: React.FC<AgentEditDialogProps> = ({
  isOpen,
  onClose,
  agentUID,
  currentNickname,
  onRename,
  onDelete
}) => {
  const [newNickname, setNewNickname] = useState(currentNickname || agentUID);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRename = () => {
    if (newNickname.trim() && newNickname !== agentUID) {
      onRename(agentUID, newNickname.trim());
    }
    onClose();
  };

  const handleDelete = () => {
    onDelete(agentUID);
    onClose();
  };

  if (showDeleteConfirm) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="bg-black border border-red-400 text-green-400">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">⚠️ CONFIRM DELETION</AlertDialogTitle>
            <AlertDialogDescription className="text-green-600">
              Are you sure you want to delete agent "{agentUID}"?<br />
              This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowDeleteConfirm(false)}
              className="border border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
            >
              CANCEL
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="border border-red-400 bg-red-400/20 text-red-400 hover:bg-red-400 hover:text-black"
            >
              DELETE
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-black border border-green-400 text-green-400">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-green-400">✏️ EDIT AGENT</AlertDialogTitle>
          <AlertDialogDescription className="text-green-600">
            Modify agent settings for: {agentUID}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-green-600 text-sm mb-2">Agent Nickname/UID:</label>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="w-full bg-black border border-green-400 text-green-400 px-3 py-2 rounded focus:outline-none focus:border-cyan-400"
              placeholder="Enter new nickname..."
            />
          </div>
        </div>

        <AlertDialogFooter className="flex justify-between">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="border border-red-400 text-red-400 px-4 py-2 hover:bg-red-400 hover:text-black transition-colors"
          >
            🗑️ DELETE
          </button>
          
          <div className="flex space-x-2">
            <AlertDialogCancel className="border border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
              CANCEL
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRename}
              className="border border-cyan-400 bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400 hover:text-black"
            >
              SAVE
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AgentEditDialog;
