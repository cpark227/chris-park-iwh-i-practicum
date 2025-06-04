const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const HUBSPOT_API_BASE_URL = 'https://api.hubapi.com/crm/v3/objects';
const PRIVATE_APP_ACCESS = '';
const CUSTOM_OBJECT_TYPE_ID = '2-45669167';
const CUSTOM_PROPERTIES = [
    'name', 
    'company',     
    'price' 
];
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            `${HUBSPOT_API_BASE_URL}/${CUSTOM_OBJECT_TYPE_ID}`,
            {
                params: {
                    properties: CUSTOM_PROPERTIES.join(','), // Request specific properties
                    limit: 100 
                },
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`, 
                    'Content-Type': 'application/json'
                }
            }
        );

        const crmRecords = response.data.results; 

        res.render('homepage', {
            title: 'CRM Records | Integrating With HubSpot I Practicum',
            crmRecords: crmRecords
        });

    } catch (error) {
        console.error('Error fetching CRM data:', error.response ? error.response.data : error.message);
        res.render('homepage', {
            title: 'CRM Records | Integrating With HubSpot I Practicum',
            crmRecords: [], // Pass an empty array if there's an error
            error: 'Could not retrieve CRM data. Please check your API key, custom object ID, and network.'
        });
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/submit-cobj', async (req, res) => { 
    const { name, company, price } = req.body;

    // Map field names to HubSpot's internal property names
    const newRecordData = {
        properties: {
            [CUSTOM_PROPERTIES[0]]: name,
            [CUSTOM_PROPERTIES[1]]: company,
            [CUSTOM_PROPERTIES[2]]: price  
        }
    };

    try {
        const response = await axios.post(
            `${HUBSPOT_API_BASE_URL}/${CUSTOM_OBJECT_TYPE_ID}`,
            newRecordData,
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('CRM record created:', response.data);
        res.redirect('/'); // Redirect back to the homepage to see the new record
    } catch (error) {
        console.error('Error creating CRM record:', error.response ? error.response.data : error.message);
        res.send(`Error creating record: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    }
});


/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
