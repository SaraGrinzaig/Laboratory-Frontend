import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';
import '../css/DeviceList.css';

const DeviceList = () => {
    const [devices, setDevices] = useState([]);
    const [currentStatuses, setCurrentStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // modal control state for adding device
    const [editModalIsOpen, setEditModalIsOpen] = useState(false); // modal control state for editing device
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
            const reversedData = data.reverse();
            setDevices(reversedData);
            fetchCurrentStatuses(reversedData);
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

    const handleOpenEditModal = (device) => {
        // Open modal for editing
        setSelectedDevice(device);
        setFormData(device); 
        setEditModalIsOpen(true);
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
                setEditModalIsOpen(false); // Close modal after successful update
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
        if (newStatusId === '5') { // If status is 'Finished', open modal for final price
            setSelectedDevice(devices.find(device => device.id === deviceId));
            setEditModalIsOpen(true);
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
        setModalIsOpen(true);
    };

    // Validation schema for new device and customer fields
    const validationSchema = Yup.object({
        fullName: Yup.string().required('שם הלקוח הוא שדה חובה'),
        phoneNumber: Yup.string().required('מספר טלפון של הלקוח הוא שדה חובה'),
        email: Yup.string().email('כתובת אימייל לא תקינה').required('אימייל של הלקוח הוא שדה חובה'),
        deviceType: Yup.string().required('יש לבחור סוג מכשיר'),
        deviceModel: Yup.string().required('דגם הוא שדה חובה'),
        issueDescription: Yup.string().required('תיאור התקלה הוא שדה חובה'),
        unlockCode: Yup.string().required('קוד נעילה הוא שדה חובה'),
        estimatedPrice: Yup.number().typeError('מחיר משוער חייב להיות מספר'),
        finalPrice: Yup.number().typeError('מחיר סופי חייב להיות מספר'),
        notes: Yup.string(),
    });

    const handleAddDevice = async (values) => {
        try {
            // קריאה ל-API עבור הוספת לקוח
            console.log("Sending data:", values);
            const customerResponse = await fetch('https://localhost:5000/api/Customer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: values.fullName,
                    phone: values.phoneNumber,
                    email: values.email,
                }),
            });
    
            if (customerResponse.ok) {
                // עיכוב של 2 שניות לפני הבקשה ללקוחות כדי לוודא שהלקוח נוסף לבסיס הנתונים
                await new Promise(resolve => setTimeout(resolve, 2000));
    
                // קריאה ל-API עבור קבלת הלקוח לפי האימייל
                const customersResponse = await fetch('https://localhost:5000/api/Customer');
                const customers = await customersResponse.json();
    
                const foundCustomer = customers.find(customer => customer.email === values.email);
                if (!foundCustomer) {
                    console.error(`No matching customer found for email: ${values.email}`);
                    return;
                }
    
                console.log("Customer found:", foundCustomer);
    
                // קריאה ל-API עבור הוספת מכשיר
                const deviceResponse = await fetch('https://localhost:5000/api/Device', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customerId: foundCustomer.id,
                        deviceType: values.deviceType,
                        deviceModel: values.deviceModel,
                        issueDescription: values.issueDescription,
                        unlockCode: values.unlockCode,
                        estimatedPrice: values.estimatedPrice || null,
                        finalPrice: values.finalPrice || null,
                        notes: values.notes || null,
                    }),
                });
    
                if (deviceResponse.ok) {
                    fetchDevices();
                    setModalIsOpen(false);
                } else {
                    const errorText = await deviceResponse.text();
                    console.error('Failed to create device:', errorText);
                }
            } else {
                const errorText = await customerResponse.text();
                console.error('Failed to create customer:', errorText);
            }
        } catch (err) {
            console.error('Error in API calls:', err);
        }
    };    

    if (loading) return <div>טוען...</div>;
    if (error) return <div>שגיאה: {error}</div>;

    return (
        <div>
            <button onClick={goToAddDevicePage} className="btn btn-success" style={{ float: 'left', marginBottom: '20px' }}>
                הוסף מכשיר חדש
            </button>
            <h2 className="text-center">מכשירים</h2>

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
                                <button onClick={() => handleOpenEditModal(device)} className="btn btn-success">
                                    ערוך
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for adding a new device */}
            <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>הכנס פרטי מכשיר חדש</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            fullName: '',
                            phoneNumber: '',
                            email: '',
                            deviceType: '',
                            deviceModel: '',
                            issueDescription: '',
                            unlockCode: '',  // שדה קוד נעילה
                            estimatedPrice: '',
                            finalPrice: '',
                            notes: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleAddDevice}
                    >
                        {({ handleChange, values }) => (
                            <FormikForm>
                                <TextField
                                    name="fullName"
                                    label="שם מלא"
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                    value={values.fullName}
                                />
                                <TextField
                                    name="phoneNumber"
                                    label="מספר טלפון"
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                    value={values.phoneNumber}
                                />
                                <TextField
                                    name="email"
                                    label="אימייל"
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                    value={values.email}
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>סוג מכשיר</InputLabel>
                                    <Field
                                        as={Select}
                                        name="deviceType"
                                        label="סוג מכשיר"
                                        onChange={handleChange}
                                        value={values.deviceType}
                                    >
                                        <MenuItem value="Phone">פלאפון</MenuItem>
                                        <MenuItem value="Computer">מחשב</MenuItem>
                                        <MenuItem value="Other">אחר</MenuItem>
                                    </Field>
                                </FormControl>
                                <TextField
                                    name="deviceModel"
                                    label="דגם"
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                    value={values.deviceModel}
                                />
                                <TextField
                                    name="issueDescription"
                                    label="תיאור התקלה"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                    value={values.issueDescription}
                                />
                                <TextField
                                    name="unlockCode"
                                    label="קוד נעילה"
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                    value={values.unlockCode}
                                />
                                <TextField
                                    name="estimatedPrice"
                                    type="number"
                                    label="מחיר משוער"
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                    value={values.estimatedPrice}
                                />
                                <TextField
                                    name="finalPrice"
                                    type="number"
                                    label="מחיר סופי"
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                    value={values.finalPrice}
                                />
                                <TextField
                                    name="notes"
                                    label="הערות"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                    value={values.notes}
                                />
                                <Button type="submit" variant="success" fullWidth>
                                    שמור
                                </Button>
                            </FormikForm>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>

            {/* Modal for editing a device */}
            <Modal show={editModalIsOpen} onHide={() => setEditModalIsOpen(false)} centered>
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
                    <Button variant="secondary" onClick={() => setEditModalIsOpen(false)}>
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
