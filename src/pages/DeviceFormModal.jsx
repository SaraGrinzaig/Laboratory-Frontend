import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

Modal.setAppElement('#root');

const DeviceFormModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
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
  });

  const handleSubmit = (values) => {
    console.log(values);
    closeModal();
  };

  return (
    <div>
      <Button variant="contained" onClick={openModal}>הוסף מכשיר חדש</Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Device Form"
        shouldCloseOnOverlayClick={false}
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
          <h2>הוסף פרטי מכשיר חדש</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <h5>פרטי הלקוח</h5>
                <TextField
                  label="שם לקוח"
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.fullName && Boolean(errors.fullName)}
                  helperText={touched.fullName && errors.fullName}
                  fullWidth
                  margin="normal"
                  InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
                />

                <TextField
                  label="מספר טלפון"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  fullWidth
                  margin="normal"
                  InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
                />

                <TextField
                  label="אימייל"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth
                  margin="normal"
                  InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
                />

                <h5>פרטי מכשיר</h5>
                <FormControl fullWidth margin="normal">
                  <InputLabel>סוג מכשיר</InputLabel>
                  <Select
                    label="סוג מכשיר"
                    name="deviceType"
                    value={values.deviceType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.deviceType && Boolean(errors.deviceType)}
                    inputProps={{ dir: 'rtl' }}  // Align select text right-to-left
                  >
                    <MenuItem value=""><em>בחר סוג</em></MenuItem>
                    <MenuItem value="מחשב">מחשב</MenuItem>
                    <MenuItem value="פלאפון">פלאפון</MenuItem>
                    <MenuItem value="אחר">אחר</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="דגם"
                  name="model"
                  value={values.model}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.model && Boolean(errors.model)}
                  helperText={touched.model && errors.model}
                  fullWidth
                  margin="normal"
                  InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
                />

                <TextField
                  label="תיאור התקלה"
                  name="issueDescription"
                  multiline
                  rows={3}
                  value={values.issueDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.issueDescription && Boolean(errors.issueDescription)}
                  helperText={touched.issueDescription && errors.issueDescription}
                  fullWidth
                  margin="normal"
                  InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
                />

                <h5>פרטים נוספים</h5>
                <TextField
                  label="קוד לפתיחת המכשיר"
                  name="deviceCode"
                  value={values.deviceCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  margin="normal"
                  InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
                />

                <TextField
                  label="מחיר משוער"
                  name="estimatedPrice"
                  type="number"
                  value={values.estimatedPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.estimatedPrice && Boolean(errors.estimatedPrice)}
                  helperText={touched.estimatedPrice && errors.estimatedPrice}
                  fullWidth
                  margin="normal"
                  InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
                />

                <TextField
                  label="מחיר סופי"
                  name="finalPrice"
                  type="number"
                  value={values.finalPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.finalPrice && Boolean(errors.finalPrice)}
                  helperText={touched.finalPrice && errors.finalPrice}
                  fullWidth
                  margin="normal"
                  InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
                />

                <TextField
                  label="הערות"
                  name="notes"
                  multiline
                  rows={3}
                  value={values.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  margin="normal"
                  InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                  שמור
                </Button>
                <Button variant="outlined" onClick={closeModal} fullWidth>
                  ביטול
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
};

export default DeviceFormModal;



// import React from 'react';
// import Modal from 'react-modal';
// import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';

// Modal.setAppElement('#root');

// const DeviceFormModal = ({ modalIsOpen, closeModal }) => {
//   const initialValues = {
//     fullName: '',
//     phoneNumber: '',
//     email: '',
//     deviceType: '',
//     model: '',
//     issueDescription: '',
//     deviceCode: '',
//     estimatedPrice: '',
//     finalPrice: '',
//     notes: ''
//   };

//   const validationSchema = Yup.object({
//     fullName: Yup.string().required('שם הלקוח הוא שדה חובה'),
//     phoneNumber: Yup.string().required('מספר טלפון של הלקוח הוא שדה חובה'),
//     email: Yup.string().email('כתובת אימייל לא תקינה').required('אימייל של הלקוח הוא שדה חובה'),
//     deviceType: Yup.string().required('יש לבחור סוג מכשיר'),
//     model: Yup.string().required('דגם הוא שדה חובה'),
//     issueDescription: Yup.string().required('תיאור התקלה הוא שדה חובה'),
//     estimatedPrice: Yup.number().typeError('מחיר משוער חייב להיות מספר'),
//     finalPrice: Yup.number().typeError('מחיר סופי חייב להיות מספר'),
//   });

//   const handleSubmit = (values) => {
//     console.log(values);
//     closeModal(); // Close the modal after submitting the form
//   };

//   return (
//     <Modal
//       isOpen={modalIsOpen}
//       onRequestClose={closeModal}
//       contentLabel="Device Form"
//       shouldCloseOnOverlayClick={false}
//       style={{
//         content: {
//           top: '50%',
//           left: '50%',
//           right: 'auto',
//           bottom: 'auto',
//           marginRight: '-50%',
//           transform: 'translate(-50%, -50%)',
//           width: '400px'
//         }
//       }}
//     >
//       <div dir="rtl">
//         <h2>הוסף פרטי מכשיר חדש</h2>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ values, handleChange, handleBlur, errors, touched }) => (
//             <Form>
//               <h5>פרטי הלקוח</h5>
//               <TextField
//                 label="שם לקוח"
//                 name="fullName"
//                 value={values.fullName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.fullName && Boolean(errors.fullName)}
//                 helperText={touched.fullName && errors.fullName}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
//               />

//               <TextField
//                 label="מספר טלפון"
//                 name="phoneNumber"
//                 value={values.phoneNumber}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.phoneNumber && Boolean(errors.phoneNumber)}
//                 helperText={touched.phoneNumber && errors.phoneNumber}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
//               />

//               <TextField
//                 label="אימייל"
//                 name="email"
//                 type="email"
//                 value={values.email}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.email && Boolean(errors.email)}
//                 helperText={touched.email && errors.email}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
//               />

//               <h5>פרטי מכשיר</h5>
//               <FormControl fullWidth margin="normal">
//                 <InputLabel>סוג מכשיר</InputLabel>
//                 <Select
//                   label="סוג מכשיר"
//                   name="deviceType"
//                   value={values.deviceType}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.deviceType && Boolean(errors.deviceType)}
//                   inputProps={{ dir: 'rtl' }}  // Align select text right-to-left
//                 >
//                   <MenuItem value=""><em>בחר סוג</em></MenuItem>
//                   <MenuItem value="מחשב">מחשב</MenuItem>
//                   <MenuItem value="פלאפון">פלאפון</MenuItem>
//                   <MenuItem value="אחר">אחר</MenuItem>
//                 </Select>
//               </FormControl>

//               <TextField
//                 label="דגם"
//                 name="model"
//                 value={values.model}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.model && Boolean(errors.model)}
//                 helperText={touched.model && errors.model}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
//               />

//               <TextField
//                 label="תיאור התקלה"
//                 name="issueDescription"
//                 multiline
//                 rows={3}
//                 value={values.issueDescription}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.issueDescription && Boolean(errors.issueDescription)}
//                 helperText={touched.issueDescription && errors.issueDescription}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
//               />

//               <TextField
//                 label="מחיר משוער"
//                 name="estimatedPrice"
//                 type="number"
//                 value={values.estimatedPrice}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.estimatedPrice && Boolean(errors.estimatedPrice)}
//                 helperText={touched.estimatedPrice && errors.estimatedPrice}
//                 fullWidth
//                 margin="normal"
//                 InputProps={{ inputProps: { dir: 'rtl' } }}  // Align input text right-to-left
//               />

//               <Button type="submit" variant="contained" color="primary" fullWidth>
//                 שמור
//               </Button>
//               <Button variant="outlined" onClick={closeModal} fullWidth>
//                 ביטול
//               </Button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </Modal>
//   );
// };

// export default DeviceFormModal;
