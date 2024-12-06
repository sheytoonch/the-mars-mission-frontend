import { useState } from 'react';
import * as XLSX from 'xlsx';
import './LeftPanel.css';
import '../Panels.css';
import { Astronaut } from '../../../types';

const apiUrl = process.env.BACKEND_URL;

interface LeftPanelProps {
    astronauts: Astronaut[];
    setAstronauts: React.Dispatch<React.SetStateAction<Astronaut[]>>;
    onAstronautClick: (astronaut: Astronaut) => void;
    setIsAdding: (isAdding: boolean) => void;
    setLogMessage: (message: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ astronauts, setAstronauts, onAstronautClick, setIsAdding, setLogMessage }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    // should it be there or moved to the app.tsx if it is a globally used function?
    const handleDelete = async (id: number) => {
        try {
            await fetch(`${apiUrl}/astronauts/${id}`, {
                method: 'DELETE',
            });
            setAstronauts(astronauts.filter((astronaut) => astronaut.id !== id));
            setLogMessage('Astronaut deleted');
        } catch (error) {
            console.error('Error deleting astronaut:', error);
        }
    };

    const handleExport = () => {
        const filteredAstronauts = astronauts.filter((astronaut) =>
            astronaut.name && astronaut.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const worksheet = XLSX.utils.json_to_sheet(filteredAstronauts);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Astronauts');
        XLSX.writeFile(workbook, 'astronauts.xlsx');
        setLogMessage('Invoice sending...');
    };

    const handleAddClick = () => {
        setIsAdding(true);
        setLogMessage('Adding new astronaut');
    };

    return (
        <div className="left-panel panel">
            <div className="button-group">
                <button className="normal-button" onClick={handleAddClick}>New</button>
                <button className="normal-button" onClick={handleExport}>Export</button>
            </div>
            <input
                type="text"
                placeholder="Search astronauts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
            />
            <div className="scroll-space">
                <ul>
                    {astronauts
                        .filter((astronaut) => astronaut.name && astronaut.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((astronaut) => (
                            <li key={astronaut.id} className="list-element">
                                <button className="list-element-left-side" onClick={() => handleDelete(astronaut.id)}>
                                    <span className="astronaut-id">{astronaut.id}</span>
                                    <span className="trash-icon">&#10006;</span>
                                </button>
                                <div className="list-element-right-side" onClick={() => onAstronautClick(astronaut)}>
                                    <div className="astronaut-info">
                                        <div className="item-astronaut-name">{astronaut.name}</div>
                                        <div className="item-astronaut-role">{astronaut.role}</div>
                                    </div>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    )
}

export default LeftPanel;