import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import '../css/DeviceList.css';

const DeviceList = () => {
    const [devices, setDevices] = useState([]);
    const [currentStatuses, setCurrentStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedDevice, setSelectedDevice] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await fetch('https://localhost:5000/api/Device');
            const data = await response.json();
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
        setFormData(device); 
        setModalIsOpen(true); 
    };

    const handleFinalPriceSubmit = async () => {
        try {
            const response = await fetch(`https://localhost:5000/api/Device/${selectedDevice.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchDevices();
                setModalIsOpen(false); 
            } else {
                console.error('Failed to update the device.');
            }
        } catch (err) {
            console.error('Error updating the device:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleStatusChange = async (deviceId, newStatusId) => {
        if (newStatusId === '5') {
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
                    fetchDevices(); 
                } else {
                    console.error('Failed to update status.');
                }
            } catch (err) {
                console.error('Error updating status:', err);
            }
        }
    };

    const goToAddDevicePage = () => {
        navigate('/add-device');
    };

    if (loading) return <div>טוען...</div>;
    if (error) return <div>שגיאה: {error}</div>;

    return (
        <div>
            <button onClick={goToAddDevicePage} className="btn btn-success" style={{ float: 'left', marginBottom: '20px' }}>
                הוסף מכשיר חדש
            </button>
            <h1 className="text-center">רשימת מכשירים</h1>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>סוג</th>
                        <th>דגם</th>
                        <th>תקלה</th>
                        <th>סטטוס נוכחי</th>
                        <th>מחיר משוער</th>
                        <th>מחיר סופי</th>
                        <th>פעולות</th>
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
                            <td>
                                <button onClick={() => handleOpenModal(device)} className="btn btn-success">
                                    ערוך
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>ערוך את {selectedDevice?.deviceModel}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formDeviceType">
                            <Form.Label>סוג</Form.Label>
                            <Form.Control
                                type="text"
                                name="deviceType"
                                value={formData.deviceType || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDeviceModel">
                            <Form.Label>דגם</Form.Label>
                            <Form.Control
                                type="text"
                                name="deviceModel"
                                value={formData.deviceModel || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formIssueDescription">
                            <Form.Label>תקלה</Form.Label>
                            <Form.Control
                                type="text"
                                name="issueDescription"
                                value={formData.issueDescription || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEstimatedPrice">
                            <Form.Label>מחיר משוער</Form.Label>
                            <Form.Control
                                type="number"
                                name="estimatedPrice"
                                value={formData.estimatedPrice || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formFinalPrice">
                            <Form.Label>מחיר סופי</Form.Label>
                            <Form.Control
                                type="number"
                                name="finalPrice"
                                value={formData.finalPrice || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalIsOpen(false)}>
                        סגור
                    </Button>
                    <Button variant="success" onClick={handleFinalPriceSubmit}>
                        שמור
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DeviceList;
