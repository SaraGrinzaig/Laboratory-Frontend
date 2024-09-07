import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../css/DeviceList.css';

Modal.setAppElement('#root');  // קביעת האלמנט הבסיסי למודל

const DeviceList = () => {
    const [devices, setDevices] = useState([]);
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
            setDevices(data);
            setLoading(false);
        } catch (err) {
            setError('נכשל בטעינת המכשירים: ' + err.message);
            setLoading(false);
        }
    };

    const handleOpenModal = (device) => {
        setSelectedDevice(device);
        setModalIsOpen(true);
    };

    const handleFinalPriceSubmit = async () => {
        const update = {
            status: 'הסתיים',
            finalPrice: selectedDevice.finalPriceInput
        };
        try {
            await fetch(`https://localhost:5000/api/Device/${selectedDevice.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update)
            });
            setModalIsOpen(false);
            fetchDevices();
        } catch (err) {
            console.error('נכשל בעדכון המכשיר', err);
        }
    };

    const handlePriceChange = (e) => {
        setSelectedDevice({ ...selectedDevice, finalPriceInput: e.target.value });
    };

    const handleStatusChange = async (deviceId, newStatus) => {
        const update = { status: newStatus };
        try {
            await fetch(`https://localhost:5000/api/Device/${deviceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update)
            });
            fetchDevices(); // רענון רשימת המכשירים לאחר עדכון
        } catch (err) {
            console.error('שגיאה בעדכון הסטטוס של המכשיר', err);
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
                        <th>מחיר משוער</th>
                        <th>סטטוס</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map(device => (
                        <tr key={device.id}>
                            <td>{device.deviceType}</td>
                            <td>{device.deviceModel}</td>
                            <td>{device.issueDescription}</td>
                            <td>₪{device.estimatedPrice.toFixed(2)}</td>
                            <td>
                                <select value={device.status} onChange={(e) => handleStatusChange(device.id, e.target.value)}>
                                    <option value="נכנס">נכנס</option>
                                    <option value="בטיפול">בטיפול</option>
                                    <option value="הוזמן רכיב">הוזמן רכיב</option>
                                    <option value="תקוע">תקוע</option>
                                    <option value="הסתיים">הסתיים</option>
                                </select>
                            </td>
                            <td>
                                {device.status === 'הסתיים' ? (
                                    <button onClick={() => handleOpenModal(device)}>הכנס מחיר סופי</button>
                                ) : (
                                    <button onClick={() => handleOpenModal(device)}>עדכן סטטוס</button>
                                )}
                            </td>
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
                        width: '30%'  // גודל החלונית
                    }
                }}
            >
                <h2>הכנס מחיר סופי ל{selectedDevice?.deviceModel}</h2>
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
