import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

Modal.setAppElement('#root');

const DeviceFormModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(true);

  const closeModal = () => setModalIsOpen(false);

  const initialValues = {
    fullName: '',
    phoneNumber: '',
    email: '',
    deviceType: '',
    model: '',
    issueDescription: '',
    deviceCode: '',
    estimatedPrice: '',
    finalPrice: '',
    notes: ''
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('שם הלקוח הוא שדה חובה'),
    phoneNumber: Yup.string().required('מספר טלפון של הלקוח הוא שדה חובה'),
    email: Yup.string().email('כתובת אימייל לא תקינה').required('אימייל של הלקוח הוא שדה חובה'),
    deviceType: Yup.string().required('יש לבחור סוג מכשיר'),
    model: Yup.string().required('דגם הוא שדה חובה'),
    issueDescription: Yup.string().required('תיאור התקלה הוא שדה חובה'),
    estimatedPrice: Yup.number().typeError('מחיר משוער חייב להיות מספר'),
    finalPrice: Yup.number().typeError('מחיר סופי חייב להיות מספר'),
    notes: Yup.string()
  });

  const handleSubmit = (values) => {
    console.log(values);
    closeModal();
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="הכנס פרטי מכשיר חדש"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '400px'
        }
      }}
    >
      <div dir="rtl">
        <h2>הכנס פרטי מכשיר חדש</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <TextField name="fullName" label="שם מלא" fullWidth margin="normal" />
            <TextField name="phoneNumber" label="מספר טלפון" fullWidth margin="normal" />
            <TextField name="email" type="email" label="אימייל" fullWidth margin="normal" />
            <FormControl fullWidth margin="normal">
              <InputLabel>סוג מכשיר</InputLabel>
              <Select name="deviceType" label="סוג מכשיר" defaultValue="">
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Phone">פלאפון</MenuItem>
                <MenuItem value="Computer">מחשב</MenuItem>
                <MenuItem value="Other">אחר</MenuItem>
              </Select>
            </FormControl>
            <TextField name="model" label="דגם" fullWidth margin="normal" />
            <TextField name="issueDescription" label="תיאור התקלה" multiline rows={3} fullWidth margin="normal" />
            <TextField name="estimatedPrice" type="number" label="מחיר משוער" fullWidth margin="normal" />
            <TextField name="finalPrice" type="number" label="מחיר סופי" fullWidth margin="normal" />
            <TextField name="notes" label="הערות" multiline rows={3} fullWidth margin="normal" />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              שמור
            </Button>
          </Form>
        </Formik>
      </div>
    </Modal>
  );
};

export default DeviceFormModal;
