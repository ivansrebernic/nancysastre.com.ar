import type { APIRoute } from 'astro';
import { addContactToHubSpot } from '../../lib/hubspot-api';

export const prerender = false; // This API route should run on the server

export const POST: APIRoute = async ({ request }) => {
  // Check if access token is configured
  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    console.error('HubSpot access token not found in environment variables');
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'HubSpot access token not configured' 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
  
  console.log('HubSpot API called with token:', process.env.HUBSPOT_ACCESS_TOKEN ? 'Token present' : 'Token missing');
  
  try {
    // Parse the request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields' 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Add contact to HubSpot
    const success = await addContactToHubSpot({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      source: 'Website - Únete al equipo'
    });
    
    if (success) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Contact added successfully' 
        }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to add contact to HubSpot' 
        }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};