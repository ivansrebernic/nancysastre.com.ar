import type { APIRoute } from 'astro';
import { getContactByToken } from '../../lib/hubspot-api';

export const prerender = false; // This API route should run on the server

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token');
  
  if (!token) {
    return new Response(JSON.stringify({ valid: false, error: 'No token provided' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const contact = await getContactByToken(token);
    
    if (contact) {
      return new Response(JSON.stringify({ 
        valid: true, 
        contact: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({ valid: false, error: 'Invalid token' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Error validating token:', error);
    return new Response(JSON.stringify({ valid: false, error: 'Server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};