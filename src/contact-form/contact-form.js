import React, { useState } from 'react';
import './styled.scss';

const EMAIL_FIELD = 'tvtqk';

const ContactForm = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const updateInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      setError('');
    }
    if (success) {
      setSuccess('');
    }
    if (loading) {
      setLoading('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (await send()) {
        setSuccess('Success');
        setLoading(false);
        setFormData({
          name: '',
          [EMAIL_FIELD]: '',
          message: '',
          /* --- honey pot --- */
          email: '',
          /* --- honey pot --- */
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  const send = async () => {
    const endpoint = 'https://us-central1-contact-form-test-ab6ae.cloudfunctions.net/contact';
    const data = {...formData};
    const params = {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
     // redirect: 'follow', // manual, *follow, error
      //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    };

    const res = await fetch(endpoint, params);
    if (!res.ok || res.status > 300) {
      console.log(res);
      throw new Error(`${res.status}: ${res.statusText}`);
    } 
    console.log('Success');
    return true;
  };
// <input type="text" name="a_password" style="display:none !important" tabindex="-1" autocomplete="off">
/*
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        height: 0;
        width: 0;
        z-index: -1;
        */  
return (
      <form onSubmit={handleSubmit}>
        {loading && !error && <div>Loading...</div>}
        {error && <div>Error:{error}</div>}
        {success && <div>{success}</div>}

        { /* --- honey pot --- */ }
        <input
          type="email"
          name="email"
          tabIndex="-1"
          autoComplete="nope"
          placeholder="Email"
          onChange={updateInput}
          value={formData.email || ''}
        />
        { /* --- honey pot --- */ }

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={updateInput}
          value={formData.name || ''}
        />
        <input
          type="email"
          name={EMAIL_FIELD}
          placeholder="Email"
          onChange={updateInput}
          value={formData[EMAIL_FIELD] || ''}
        />
        <textarea
          type="text"
          name="message"
          placeholder="Message"
          onChange={updateInput}
          value={formData.message || ''}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
  );
};

export default ContactForm;