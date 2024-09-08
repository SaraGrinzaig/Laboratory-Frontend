import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/DeviceList.css'; // Reusing the same CSS for consistent styling

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                            <td>{customer.phoneNumber}</td>
                            <td>{customer.email}</td>
                            <td>
                                <button className="btn btn-success">ערוך</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerList;
