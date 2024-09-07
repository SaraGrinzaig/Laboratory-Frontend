import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../css/DeviceList.css';

Modal.setAppElement('#root');

const DeviceList = () => {
    const [devices, setDevices] = useState([]);
    const [currentStatuses, setCurrentStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await fetch('https://localhost:5000/api/Device');
            const data = await response.json();
            console.log('Devices data:', data);
            setDevices(data);
            fetchCurrentStatuses(data);
        } catch (err) {
            setError('נכשל בטעינת המכשירים: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentStatuses = async (devices) => {
        const statusPromises = devices.map(async (device) => {
            const response = await fetch(`https://localhost:5000/api/Status/current/${device.id}`);
            if (!response.ok) {
                console.error(`Error fetching status for device ${device.id}: ${response.statusText}`);
                return { deviceId: device.id, status: null };
            }
            const statusData = await response.json();
            return { deviceId: device.id, status: statusData };
        });

        const statuses = await Promise.all(statusPromises);
        const statusMap = {};
        statuses.forEach(({ deviceId, status }) => {
            statusMap[deviceId] = status;
        });
        setCurrentStatuses(statusMap);
    };

    const handleOpenModal = (device) => {
        setSelectedDevice(device);
        setModalIsOpen(true);
    };

    const handleFinalPriceSubmit = async () => {
        if (!selectedDevice.finalPriceInput) {
            alert('נא להזין מחיר סופי');
            return;
        }
    
        const updatedDevice = { ...selectedDevice, finalPrice: selectedDevice.finalPriceInput };
        try {
            const response = await fetch(`https://localhost:5000/api/Device/${selectedDevice.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDevice),
            });
    
            if (response.ok) {
                fetchDevices(); // עדכון רשימת המכשירים לאחר השינוי
                setModalIsOpen(false);
            } else {
                console.error('Failed to update final price.');
            }
        } catch (err) {
            console.error('Error updating final price:', err);
        }
    };

    const handlePriceChange = (e) => {
        setSelectedDevice({ ...selectedDevice, finalPriceInput: e.target.value });
    };

    const handleStatusChange = async (deviceId, newStatusId) => {
        if (newStatusId === '5') { // מספר הזיהוי של סטטוס 'הסתיים'
            setSelectedDevice(devices.find(device => device.id === deviceId));
            setModalIsOpen(true);
        } else {
            const newStatus = {
                deviceId,
                statusId: newStatusId,
                statusChangeDate: new Date().toISOString(),
            };
    
            try {
                const response = await fetch(`https://localhost:5000/api/Status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newStatus),
                });
    
                if (response.ok) {
                    fetchDevices(); // רענון רשימת המכשירים לאחר עדכון הסטטוס
                } else {
                    console.error('Failed to update status.');
                }
            } catch (err) {
                console.error('Error updating status:', err);
            }
        }
    };

    if (loading) return <div>טוען...</div>;
    if (error) return <div>שגיאה: {error}</div>;

    return (
        <div>
            <h1>רשימת מכשירים</h1>
            <table>
                <thead>
                    <tr>
                        <th>סוג</th>
                        <th>דגם</th>
                        <th>תקלה</th>
                        <th>סטטוס נוכחי</th>
                        <th>מחיר משוער</th>
                        <th>מחיר סופי</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map((device) => (
                        <tr key={device.id}>
                            <td>{device.deviceType}</td>
                            <td>{device.deviceModel}</td>
                            <td>{device.issueDescription}</td>
                            <td>
                                <select
                                    value={currentStatuses[device.id]?.statusId || 'לא זמין'}
                                    onChange={(e) => handleStatusChange(device.id, e.target.value)}
                                >
                                    <option value="1">נכנס</option>
                                    <option value="2">בטיפול</option>
                                    <option value="3">הוזמן רכיב</option>
                                    <option value="4">תקוע</option>
                                    <option value="5">הסתיים</option>
                                </select>
                            </td>
                            <td>₪{device.estimatedPrice ? device.estimatedPrice.toFixed(2) : ''}</td>
                            <td>{device.finalPrice ? `₪${device.finalPrice.toFixed(2)}` : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="הכנס מחיר סופי"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '30%',
                    },
                }}
            >
                <h2>הכנס מחיר סופי ל-{selectedDevice?.deviceModel}</h2>
                <input
                    type="number"
                    value={selectedDevice?.finalPriceInput || ''}
                    onChange={handlePriceChange}
                    style={{ width: '100%' }}
                />
                <button onClick={handleFinalPriceSubmit}>שלח</button>
            </Modal>
        </div>
    );
};

export default DeviceList;



// import React, { useState, useEffect } from 'react';
// import DeviceFormModal from './DeviceFormModal'; // Import the DeviceFormModal component
// import Modal from 'react-modal';
// import '../css/DeviceList.css';

// Modal.setAppElement('#root');  // Set the root element for the modal

// const DeviceList = () => {
//     const [devices, setDevices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state for DeviceFormModal

//     useEffect(() => {
//         fetchDevices();
//     }, []);

//     const fetchDevices = async () => {
//         try {
//             const response = await fetch('https://localhost:5000/api/Device');
//             const data = await response.json();
//             setDevices(data);
//             setLoading(false);
//         } catch (err) {
//             setError('נכשל בטעינת המכשירים: ' + err.message);
//             setLoading(false);
//         }
//     };

//     const openModal = () => {
//         setModalIsOpen(true);
//     };

//     const closeModal = () => {
//         setModalIsOpen(false);
//     };

//     if (loading) return <div>טוען...</div>;
//     if (error) return <div>שגיאה: {error}</div>;

//     return (
//         <div>
//             <h1>רשימת מכשירים</h1>

//             {/* Button to open the modal for adding a new device */}
//             <button onClick={openModal}>הוסף מכשיר חדש</button>

//             {/* Device Form Modal */}
//             <DeviceFormModal modalIsOpen={modalIsOpen} closeModal={closeModal} />

//             <table>
//                 <thead>
//                     <tr>
//                         <th>סוג</th>
//                         <th>דגם</th>
//                         <th>תקלה</th>
//                         <th>מחיר משוער</th>
//                         <th>סטטוס</th>
//                         <th>פעולות</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {devices.map(device => (
//                         <tr key={device.id}>
//                             <td>{device.deviceType}</td>
//                             <td>{device.deviceModel}</td>
//                             <td>{device.issueDescription}</td>
//                             <td>₪{device.estimatedPrice.toFixed(2)}</td>
//                             <td>{device.status}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default DeviceList;
