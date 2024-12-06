import React, { useState, useEffect } from 'react';
import './MiddlePanel.css';
import '../Panels.css';
import { Astronaut } from '../../../types';

interface MiddlePanelProps {
    selectedAstronaut: Astronaut | null;
    onDelete: (id: number) => void;
    onUpdate: (astronaut: Astronaut) => void;
    onAdd: (astronaut: Partial<Astronaut>) => void; // here is the problem, because it is sometimes partial
    isAdding: boolean;
    setIsAdding: (isAdding: boolean) => void;
    setSelectedAstronaut: (astronaut: Astronaut | null) => void;
}

const MiddlePanel: React.FC<MiddlePanelProps> = ({ selectedAstronaut, onDelete, onUpdate, onAdd, isAdding, setIsAdding, setSelectedAstronaut }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [nameError, setNameError] = useState('');
    const [roleError, setRoleError] = useState('');

    useEffect(() => {
        if (selectedAstronaut && !isAdding) {
            setName(selectedAstronaut.name);
            setRole(selectedAstronaut.role);
        } else {
            setName('');
            setRole('');
        }
    }, [selectedAstronaut, isAdding]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setName(value);
        if (value.length < 3 || value.length > 50) {
            setNameError('Name must be between 3 and 50 characters');
        } else if (/\d/.test(value)) {
            setNameError('Name cannot contain numbers');
        } else {
            setNameError('');
        }
    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setRole(value);
        if (value.length < 3 || value.length > 50) {
            setRoleError('Role must be between 3 and 50 characters');
        } else if (/\d/.test(value)) {
            setRoleError('Role cannot contain numbers');
        } else {
            setRoleError('');
        }
    };

    const handleDelete = () => {
        if (selectedAstronaut) {
            onDelete(selectedAstronaut.id);
        }
    };

    const handleUpdate = () => {
        if (selectedAstronaut && !nameError && !roleError) {
            const updatedAstronaut = { ...selectedAstronaut, name, role };
            onUpdate(updatedAstronaut);
        }
    };

    const handleAdd = () => {
        if (!nameError && !roleError && name && role) {
            const newAstronaut: Partial<Astronaut> = {
                name,
                role,
            };
            onAdd(newAstronaut);
            setIsAdding(false);
            setSelectedAstronaut(null);
        }
    };

    const handleCancel = () => {
        setIsAdding(false);
        setSelectedAstronaut(null);
    };

    if (!selectedAstronaut && !isAdding) {
        return <div className="middle-panel panel"><h2>The Mars Mission Console</h2></div>;
    }

    return (
        <div className="middle-panel panel">
            <h2>The Mars Mission Console</h2>
            <div>
                <form>
                    {!isAdding && selectedAstronaut && (
                        <div className="form-group">
                            <label htmlFor="id">Astronaut ID:</label>
                            <input type="text" id="id" name="id" value={selectedAstronaut.id} readOnly className="input-field id-field" />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleNameChange}
                            className="input-field name-field"
                            minLength={3}
                            maxLength={50}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role:</label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={role}
                            onChange={handleRoleChange}
                            className="input-field role-field"
                            minLength={3}
                            maxLength={50}
                        />
                    </div>
                    <div>
                        {isAdding ? (
                            <>
                                <button className="normal-button" type="button" onClick={handleAdd}>Add</button>
                                <button className="normal-button" type="button" onClick={handleCancel}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button className="normal-button" type="button" onClick={handleUpdate}>Update</button>
                                <button className="normal-button" type="button" onClick={handleDelete}>Delete</button>
                                <button className="normal-button" type="button" onClick={handleCancel}>Cancel</button>
                            </>
                        )}
                    </div>
                    {nameError && <span className="error"> {nameError}</span>}
                    {roleError && <span className="error"> {roleError}</span>}
                </form>
            </div>
        </div>
    );
};

export default MiddlePanel;