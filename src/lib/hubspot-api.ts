// HubSpot API Integration
import crypto from 'crypto';

interface HubSpotConfig {
  accessToken: string;
  portalId?: string; // Optional, for tracking
}

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source?: string;
}

interface ContactWithToken extends ContactData {
  onboardingToken?: string;
}

// Get config from environment - will be populated at runtime
const getHubSpotConfig = (): HubSpotConfig => ({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN || '',
  portalId: process.env.HUBSPOT_PORTAL_ID // Optional
});

// Get site URL from environment
const getSiteUrl = (): string => {
  return process.env.SITE_URL || 'https://hidratacionsaludable.com.ar';
};

// Generate a secure onboarding token
function generateOnboardingToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function addContactToHubSpot(contactData: ContactData): Promise<boolean> {
  console.log('Adding contact to HubSpot:', contactData);
  
  const HUBSPOT_CONFIG = getHubSpotConfig();
  
  if (!HUBSPOT_CONFIG.accessToken) {
    console.error('HubSpot access token is missing!');
    console.error('Make sure HUBSPOT_ACCESS_TOKEN is set in environment variables');
    return false;
  }
  
  const endpoint = 'https://api.hubapi.com/crm/v3/objects/contacts';
  
  // Generate unique onboarding token
  const onboardingToken = generateOnboardingToken();
  console.log('Generated onboarding token:', onboardingToken);
  
  // Prepare contact properties
  const properties: Record<string, any> = {
    firstname: contactData.firstName,
    lastname: contactData.lastName,
    email: contactData.email,
    lifecyclestage: 'lead',
    hs_lead_status: 'NEW',
    // Custom property to identify the source form
    // Note: You need to create this property in HubSpot first
    form_source: 'unete_al_equipo',
    // Custom property for onboarding page access
    // Note: You need to create this property in HubSpot first
    onboarding_token: onboardingToken
  };
  
  // Add phone if provided
  if (contactData.phone) {
    properties.phone = contactData.phone;
  }
  
  // Add source information to the contact's notes or description
  // We'll use the 'notes' property or add it to lifecycle stage notes
  // Note: hs_analytics_source_data_1 is read-only, so we can't set it directly

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUBSPOT_CONFIG.accessToken}`
      },
      body: JSON.stringify({ properties })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('HubSpot API error:', error);
      console.error('Response status:', response.status);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Check for duplicate contact (409 Conflict)
      if (response.status === 409) {
        console.log('Contact already exists in HubSpot');
        // You might want to update the existing contact instead
        return true; // Consider this a success
      }
      
      // Check for property not found error
      if (error.message && error.message.includes('onboarding_token')) {
        console.error('❌ The onboarding_token property does not exist in HubSpot!');
        console.error('Please create it in HubSpot Settings → Properties → Contact properties');
      }
      
      return false;
    }

    const result = await response.json();
    console.log('✅ Contact created in HubSpot:', result.id);
    console.log('Onboarding URL:', `${getSiteUrl()}/bienvenido/${onboardingToken}`);
    
    // If we have a source, add it as a note to the contact
    if (contactData.source && result.id) {
      try {
        const noteEndpoint = `https://api.hubapi.com/crm/v3/objects/notes`;
        const noteResponse = await fetch(noteEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${HUBSPOT_CONFIG.accessToken}`
          },
          body: JSON.stringify({
            properties: {
              hs_note_body: `Fuente: ${contactData.source}\nFecha de registro: ${new Date().toLocaleString('es-AR')}`,
              hs_timestamp: Date.now()
            },
            associations: [
              {
                to: { id: result.id },
                types: [
                  {
                    associationCategory: 'HUBSPOT_DEFINED',
                    associationTypeId: 202 // Note to Contact association
                  }
                ]
              }
            ]
          })
        });
        
        if (!noteResponse.ok) {
          console.error('Failed to add note to contact, but contact was created');
        }
      } catch (noteError) {
        console.error('Error adding note:', noteError);
        // Don't fail the whole operation if note fails
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error adding contact to HubSpot:', error);
    return false;
  }
}

// Helper function to get HubSpot forms (useful for finding form IDs)
export async function getHubSpotForms(): Promise<any[]> {
  const HUBSPOT_CONFIG = getHubSpotConfig();
  
  if (!HUBSPOT_CONFIG.accessToken) {
    console.error('HubSpot access token not configured');
    return [];
  }

  try {
    const response = await fetch('https://api.hubapi.com/marketing/v3/forms', {
      headers: {
        'Authorization': `Bearer ${HUBSPOT_CONFIG.accessToken}`
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch HubSpot forms');
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching HubSpot forms:', error);
    return [];
  }
}

// Get contact by onboarding token
export async function getContactByToken(token: string): Promise<ContactWithToken | null> {
  const HUBSPOT_CONFIG = getHubSpotConfig();
  
  console.log('[HubSpot API] getContactByToken called with token:', token);
  console.log('[HubSpot API] HubSpot access token configured:', !!HUBSPOT_CONFIG.accessToken);
  
  if (!HUBSPOT_CONFIG.accessToken || !token) {
    console.error('[HubSpot API] Missing access token or token parameter');
    return null;
  }

  try {
    // Search for contact with the given token
    const searchEndpoint = 'https://api.hubapi.com/crm/v3/objects/contacts/search';
    const searchBody = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'onboarding_token',
              operator: 'EQ',
              value: token
            }
          ]
        }
      ],
      properties: ['firstname', 'lastname', 'email', 'phone', 'onboarding_token', 'createdate']
    };
    
    console.log('[HubSpot API] Search request body:', JSON.stringify(searchBody, null, 2));
    
    const response = await fetch(searchEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUBSPOT_CONFIG.accessToken}`
      },
      body: JSON.stringify(searchBody)
    });

    console.log('[HubSpot API] Search response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[HubSpot API] Search failed with error:', errorData);
      
      // Check if the error is related to the property not existing
      if (errorData.message && errorData.message.includes('onboarding_token')) {
        console.error('[HubSpot API] ❌ The onboarding_token property might not exist in HubSpot');
        console.error('[HubSpot API] Please verify it exists in HubSpot Settings → Properties → Contact properties');
      }
      
      return null;
    }

    const data = await response.json();
    console.log('[HubSpot API] Search results count:', data.results?.length || 0);
    
    if (data.results && data.results.length > 0) {
      const contact = data.results[0];
      console.log('[HubSpot API] Contact found:', {
        id: contact.id,
        email: contact.properties.email,
        hasOnboardingToken: !!contact.properties.onboarding_token
      });
      
      return {
        firstName: contact.properties.firstname || '',
        lastName: contact.properties.lastname || '',
        email: contact.properties.email || '',
        phone: contact.properties.phone || '',
        onboardingToken: contact.properties.onboarding_token || ''
      };
    }
    
    console.log('[HubSpot API] No contact found with token:', token);
    return null;
  } catch (error) {
    console.error('[HubSpot API] Error fetching contact by token:', error);
    return null;
  }
}