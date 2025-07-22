import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import '../css/excelView.css';

const ExcelEditor = ({ filePath }) => {
    const [excelData, setExcelData] = useState([]);
    const [editableData, setEditableData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExcel = async () => {
            try {
                setLoading(true);
                const res = await axios.get(filePath, { responseType: 'arraybuffer' });
                const workbook = XLSX.read(res.data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                setExcelData(json);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchExcel();
    }, [filePath]);

    const handleEdit = () => {
        setEditableData(JSON.parse(JSON.stringify(excelData))); // Deep copy
        setIsEditing(true);
    };

    const handleCellChange = (rowIdx, colIdx, value) => {
        const updated = [...editableData];
        updated[rowIdx][colIdx] = value;
        setEditableData(updated);
    };

    const handleSave = () => {
        setExcelData(editableData); // Just update the viewer
        setIsEditing(false);
    };

    if (loading) return <p>Loading Excel data...</p>;
    if (error) return <p>Error loading Excel data: {error}</p>;

    return (
        <div className="excel-container position-relative">
            {!isEditing && (
                <button
                    className="btn btn-primary"
                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                    onClick={handleEdit}
                >
                    Edit
                </button>
            )}

            <table className="excel-table">
                <thead>
                    <tr>
                        {(isEditing ? editableData : excelData)[0]?.map((cell, idx) => (
                            <th key={idx}>{cell}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {(isEditing ? editableData : excelData)
                        .slice(1)
                        .map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                {row.map((cell, colIdx) => (
                                    <td key={colIdx}>
                                        {isEditing ? (
                                            <input
                                                className="excel-input"
                                                value={cell}
                                                onChange={(e) =>
                                                    handleCellChange(rowIdx + 1, colIdx, e.target.value)
                                                }
                                            />
                                        ) : (
                                            cell
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>

            {isEditing && (
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <button className="btn btn-success me-2" onClick={handleSave}>
                        Save
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExcelEditor;
