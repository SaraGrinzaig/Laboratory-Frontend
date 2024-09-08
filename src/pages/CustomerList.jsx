import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import '../css/DeviceList.css'; // Reusing the same CSS for consistent styling

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('https://localhost:5000/api/Customer');
            const data = await response.json();
            setCustomers(data);
        } catch (err) {
            setError('נכשל בטעינת הלקוחות: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (customer) => {
        setSelectedCustomer(customer);
        setFormData(customer); // Initialize form data with selected customer details
        setModalIsOpen(true);  // Open modal
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`https://localhost:5000/api/Customer/${selectedCustomer.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchCustomers();  // Refresh the customer list
                setModalIsOpen(false); // Close the modal
            } else {
                console.error('Failed to update customer.');
            }
        } catch (err) {
            console.error('Error updating customer:', err);
        }
    };

    if (loading) return <div>טוען...</div>;
    if (error) return <div>שגיאה: {error}</div>;

    return (
        <div>
            <h1 className="text-center">לקוחות</h1>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>שם מלא</th>
                        <th>מספר טלפון</th>
                        <th>אימייל</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.fullName}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.email}</td>
                            <td>
                                <button className="btn btn-success" onClick={() => handleOpenModal(customer)}>
                                    ערוך
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Bootstrap Modal for Editing Customer */}
            <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>ערוך את {selectedCustomer?.fullName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFullName">
                            <Form.Label>שם מלא</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={formData.fullName || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPhone">
                            <Form.Label>מספר טלפון</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>אימייל</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalIsOpen(false)}>
                        סגור
                    </Button>
                    <Button variant="success" onClick={handleSaveChanges}>
                        שמור
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CustomerList;
